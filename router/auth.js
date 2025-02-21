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
const { check, body } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
route.get("/login", getLogin);

route.post(
  "/login",
  [
    body("email", "Please enter a valid email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("User is not valid");
          }
        });
      }),
    body("password", "password is not correct")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        return User.findOne({
          email: req.body.email,
        })
          .then((user) => {
            if (user) {
              return bcrypt.compare(value, user.password);
            }
          })
          .then((isMatch) => {
            if (!isMatch) {
              return Promise.reject("Password is not correct");
            }
          });
      }),
  ],
  postLogin
);

route.get("/signup", getSignUp);

route.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("User already exist.");
          }
          return true;
        });
      }),
    body(
      "password",
      "Password must be at least 5 characters long and alphanumeric"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
  ],
  postSignUp
);

route.post("/logout", postLogout);

route.get("/reset", getReset);

route.post("/reset", postReset);

route.get("/newPassword/:token", getNewPassword);

route.post("/new-password", postNewPassword);

module.exports = route;
