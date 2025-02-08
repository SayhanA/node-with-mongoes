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

route.get("/add-product", getProductForm);

route.get("/products", getProducts);

route.post("/add-product", postProduct);

route.get("/edit-product/:productId", getEditProduct);

route.post("/edit-product", postEditProduct);

route.post("/delete-product", deleteProduct);

module.exports = route;
