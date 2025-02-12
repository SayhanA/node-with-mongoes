const { getLogin, postLogin } = require("../controllers/auth");

const route = require("express").Router();

route.get("/login", getLogin);

route.post("/login", postLogin);

module.exports = route;
