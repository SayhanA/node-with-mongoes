const {
  getProduct,
  postProduct,
  getProducts,
  getProductForm,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

const route = require("express").Router();

const isAuth = require("../middleware/is-auth");

route.get("/add-product", isAuth, getProductForm);

route.get("/products", isAuth, getProducts);

route.post("/add-product", isAuth, postProduct);

route.get("/edit-product/:productId", isAuth, getEditProduct);

route.post("/edit-product", isAuth, postEditProduct);

route.post("/delete-product", isAuth, deleteProduct);

module.exports = route;
