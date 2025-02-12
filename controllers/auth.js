const User = require("../models/user");

const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login | shop",
    path: "/login",
    isAuthenticated: false,
  });
};

const postLogin = (req, res, next) => {
  User.findById("67a7e00ae3111519c9e58d7d")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports = { getLogin, postLogin, postLogout };
