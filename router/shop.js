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
const isAuth = require("../middleware/is-auth");

route.get("/", getIndex);

route.get("/products", getProductList);

route.get("/product/:productId", getProductById);

route.get("/cart", isAuth, getCart);

route.post("/cart", isAuth, postCart);

route.post("/cart-delete-item", isAuth, postDeleteCart);

route.post("/orders", isAuth, postOrder);

route.get("/orders", isAuth, getOrder);

// route.get("/checkout", getCheckout);

module.exports = route;
