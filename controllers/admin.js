const Products = require("../models/products");

const getProductForm = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product Form",
    path: "/admin/add-product",
    edit: false,
  });
};

const getProducts = (req, res, next) => {
  Products.fetchAll()
    .then((product) => {
      res.render("admin/products", {
        pageTitle: "products page | admin",
        props: product,
        path: "/admin/products",
      });
    })
    .catch((err) => console.error(err));
};

const postProduct = (req, res, next) => {
  const product = new Products(
    req.body.title,
    req.body.description,
    req.body.imageUrl,
    req.body.price,
    null,
    req.user._id
  );
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
      // console.log(product);
      res.render("admin/edit-product", {
        pageTitle: "Edit product page | admin",
        path: "admin/edit-product",
        props: product,
        edit: editMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditProduct = (req, res, next) => {
  const updatedProduct = new Products(
    req.body.title,
    req.body.description,
    req.body.imageUrl,
    req.body.price,
    req.body.id
  );

  updatedProduct
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};

const deleteProduct = (req, res, next) => {
  const { id } = req.body;
  Products.deleteById(id)
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
