const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    console.log({ "Product data form user model:": product });
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }

    const updateCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updateCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((product) => {
      return product.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((product) => {
        return product.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteCartItem(itemId) {
    const remainingItems = this.cart.items.filter(
      (item) => item.productId.toString() !== itemId
    );

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: remainingItems } } }
      );
  }

  addOrder() {
    const db = getDb();

    // Step 1: Fetch product details for each item in the cart
    const productIds = this.cart.items.map((item) => item.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        const enrichedItems = this.cart.items.map((cartItem) => {
          const product = products.find(
            (prod) => prod._id.toString() === cartItem.productId.toString()
          );
          product.quantity = cartItem.quantity;
          delete product["userId"];
          return product;
        });

        return db.collection("orders").insertOne({
          userId: this._id,
          items: enrichedItems,
          createdAt: new Date(),
        });
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getOrder() {
    const db = getDb();
    return db
      .collection("orders")
      .find()
      .toArray()
      .then((order) => {
        console.log(order);
        return order;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new Error("something terrible happened");
      });
  }
}

module.exports = User;
