const Products = require("../models/products");

const getIndex = (req, res, next) => {
  Products.find()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Index page | shop",
        props: products,
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

const getProductList = (req, res, next) => {
  Products.find()
    .then((data) => {
      res.render("shop/product-list", {
        pageTitle: "products-list page | shop",
        props: data,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

const getProductById = (req, res, next) => {
  const id = req?.params?.productId;
  const productById = Products.findById(id)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        props: product,
        pageTitle: product?.name,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCart = async (req, res, next) => {
  try {
    const cartItems = await req.user.populate("cart.items.productId");

    res.render("shop/cart", {
      props: cartItems.cart.items,
      pageTitle: "Cart Page | Shop",
      path: "/cart",
    });
  } catch (err) {
    next(err);
  }
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Products.findById(prodId)
    .then((product) => {
      return req.user
        .addToCart(product)
        .then((user) => {
          // console.log(user);
          res.redirect("/cart");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const postDeleteCart = (req, res, next) => {
  const id = req.body.id;
  req.user
    .deleteCartItem(id)
    .then(res.redirect("/cart"))
    .catch((err) => console.log(err));
};

const postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((order) => {
      console.log({ "Orders list": order });
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOrder = (req, res, next) => {
  req.user
    .getOrder()
    .then((order) => {
      res.render("shop/orders", {
        props: order,
        pageTitle: "Your Orders | shop",
        path: "/orders",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// const getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "shop page | shop",
//     path: "/checkout",
//   });
// };

module.exports = {
  getProductList,
  getIndex,
  getCart,
  getOrder,
  postOrder,
  // getCheckout,
  getProductById,
  postCart,
  postDeleteCart,
};
