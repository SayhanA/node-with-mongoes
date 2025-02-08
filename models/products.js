const { ObjectId } = require("mongodb");

const getDb = require("../utils/database").getDb;

class Products {
  constructor(title, description, imageUrl, price, id, userId) {
    (this.title = title),
      (this.price = price),
      (this.imageUrl = imageUrl),
      (this.description = description),
      (this._id = id ? new ObjectId(id) : null),
      (this.userId = userId);
  }
  save() {
    const db = getDb("new");
    let dbOP;

    if (this._id) {
      dbOP = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOP = db.collection("products").insertOne(this);
    }

    return dbOP
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("Database operation failed:", err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) })
      .then((product) => {
        // console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) })
      .then((result) => {
        if (result.deletedCount === 1) {
          console.log("Product successfully deleted");
        } else {
          console.log("No product found with the given ID");
        }
        return result;
      })
      .catch((err) => console.log("Error deleting product:", err));
  }
}

module.exports = Products;
