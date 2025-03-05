const { validationResult } = require("express-validator");
const Products = require("../models/products");

const getProductForm = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product Form",
    path: "/admin/add-product",
    edit: false,
    errorMessage: [],
  });
};

const getProducts = (req, res, next) => {
  Products.find({ userId: req.user._id })
    .then((product) => {
      res.render("admin/products", {
        pageTitle: "products page | admin",
        props: product,
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postProduct = (req, res, next) => {
  console.log("image is: ", req.file);
  const product = new Products({
    // _id: new mongoose.Types.ObjectId("67b7a6fa1159273d4621f73a"),
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.image,
    price: req.body.price,
    userId: req.user,
  });

  const error = validationResult(req);
  console.log("Validation error form post product: ", error.array());

  if (!error.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product Form",
      path: "/admin/add-product",
      edit: false,
      errorMessage: error.array(),
      props: req.body,
    });
  }

  product
    .save()
    .then((res) => console.log("Post Product result: ", res))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");
  Products.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit product page | admin",
        path: "admin/edit-product",
        props: product,
        edit: editMode,
        errorMessage: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const productId = req.body.id;
  req.body._id = productId;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status("422").render("admin/edit-product", {
      pageTitle: "Edit product page | admin",
      path: "admin/edit-product",
      props: req.body,
      edit: true,
      errorMessage: error.array(),
    });
  }

  Products.findById(productId)
    .then((product) => {
      console.log(product);
      if (product.userId?.toString() !== req.user._id?.toString()) {
        return res.redirect("/");
      }

      (product.title = req.body.title),
        (product.description = req.body.description),
        (product.imageUrl = req.body.imageUrl),
        (product.price = req.body.price);
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const deleteProduct = (req, res, next) => {
  const { id } = req.body;
  Products.deleteOne({ _id: id, userId: req.user._id })
    .then((product) => {
      console.log(product);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/admin/products");
};

module.exports = {
  getProductForm,
  postProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};
