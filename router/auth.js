const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
} = require("../controllers/auth");

const route = require("express").Router();

route.get("/login", getLogin);

route.post("/login", postLogin);

route.post("/logout", postLogout);

route.get("/signup", getSignUp);

route.post("/signup", postSignUp);

module.exports = route;
