const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login | shop",
    path: "/login",
    isAuthenticated: false,
  });
};

const postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};

module.exports = { getLogin, postLogin };
