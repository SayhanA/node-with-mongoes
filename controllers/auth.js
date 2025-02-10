const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login | shop",
    path: '/login'
  });
};

module.exports = { getLogin };
