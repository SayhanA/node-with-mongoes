const Products = require("../models/products");

const getProductForm = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product Form",
    path: "/admin/add-product",
    edit: false,
    isAuthenticated: req.isLoggedIn
  });
};

const getProducts = (req, res, next) => {
  Products.find()
    .then((product) => {
      res.render("admin/products", {
        pageTitle: "products page | admin",
        props: product,
        path: "/admin/products",
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch((err) => console.error(err));
};

const postProduct = (req, res, next) => {
  const product = new Products({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.user    
  });
  product
    .save()
    .then((res) => console.log(res))
    .catch((err) => {
      console.error(err);
    });

  res.redirect("/");
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
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditProduct = (req, res, next) => {
  const productId = req.body.id;
  Products.findById(productId)
    .then((product) => {
      (product.title = req.body.title),
        (product.description = req.body.description),
        (product.imageUrl = req.body.imageUrl),
        (product.price = req.body.price);
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteProduct = (req, res, next) => {
  const { id } = req.body;
  Products.findByIdAndDelete(id)
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
