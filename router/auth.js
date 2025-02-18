const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");

const route = require("express").Router();

route.get("/login", getLogin);

route.post("/login", postLogin);

route.get("/signup", getSignUp);

route.post("/signup", postSignUp);

route.post("/logout", postLogout);

route.get("/reset", getReset);

route.post("/reset", postReset);

route.get("/newPassword/:token", getNewPassword);

route.post("/new-password", postNewPassword);

module.exports = route;
