const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
} = require("../controllers/auth");

const route = require("express").Router();

route.get("/login", getLogin);

route.post("/login", postLogin);

route.get("/signup", getSignUp);

route.post("/signup", postSignUp);

route.post("/logout", postLogout);

route.get("/reset", getReset);

route.post("/reset", postReset);

module.exports = route;
