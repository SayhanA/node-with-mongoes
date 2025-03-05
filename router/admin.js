const {
  getProduct,
  postProduct,
  getProducts,
  getProductForm,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");
const { body } = require("express-validator");

const route = require("express").Router();

const isAuth = require("../middleware/is-auth");

route.get("/add-product", isAuth, getProductForm);

route.get("/products", isAuth, getProducts);

route.post(
  "/add-product",
  isAuth,
  [
    body("title", "Title is required")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Title must be minimum 5 characters")
      .isLength({ max: 100 })
      .withMessage("Title must be maximux 100 characters")
      .trim(),
    body("price", "Price must be a flate number").isFloat({ min: 0.01 }),
    body(
      "description",
      "Description must be minimum 10 character and maximum 300 character"
    ).isLength({ min: 10, max: 300 }),
  ],
  postProduct
);

route.get("/edit-product/:productId", isAuth, getEditProduct);

route.post(
  "/edit-product",
  isAuth,
  [
    body("title", "Title is required")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Title must be minimum 5 characters")
      .isLength({ max: 100 })
      .withMessage("Title must be maximux 100 characters")
      .trim(),
    body("imageUrl", "Image URL is not valid").isURL(),
    body("price", "Price must be a flate number").isFloat({ min: 0.01 }),
    body(
      "description",
      "Description must be minimum 10 character and maximum 300 character"
    ).isLength({ min: 10, max: 300 }),
  ],
  postEditProduct
);

route.post("/delete-product", isAuth, deleteProduct);

module.exports = route;
