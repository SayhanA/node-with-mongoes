const bcrypt = require("bcryptjs");
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
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              console.log(err);
              return res.redirect("/");
            });
          } else {
            return res.redirect("/login");
          }
        })
        .catch((err) => {
          console.log(err);
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

const getSignUp = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "SignUp | shop",
    path: "/signup",
    isAuthenticated: false,
  });
};

const postSignUp = (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { getLogin, postLogin, postLogout, getSignUp, postSignUp };
