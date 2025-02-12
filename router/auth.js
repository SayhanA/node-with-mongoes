const { getLogin, postLogin, postLogout } = require("../controllers/auth");

const route = require("express").Router();

route.get("/login", getLogin);

route.post("/login", postLogin);

route.post('/logout', postLogout)

module.exports = route;
