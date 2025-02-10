const { getLogin } = require("../controllers/auth");

const route = require("express").Router();

route.get("/login", getLogin);

module.exports = route;
