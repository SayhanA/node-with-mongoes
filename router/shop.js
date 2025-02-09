const {
  getIndex,
  getProductList,
  getCart,
  getCheckout,
  getProductById,
  postCart,
  deleteCart,
  postDeleteCart,
  postOrder,
  getOrder,
} = require("../controllers/shop");

const route = require("express").Router();

route.get("/", getIndex);

route.get("/products", getProductList);

route.get("/product/:productId", getProductById);

route.get("/cart", getCart);

route.post("/cart", postCart);

route.post("/cart-delete-item", postDeleteCart);

route.post("/orders", postOrder);

route.get("/orders", getOrder);

// route.get("/checkout", getCheckout);

module.exports = route;
