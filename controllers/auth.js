const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login | shop",
    path: "/login",
    isAuthenticated: false,
    errorMessage: req.flash("error"),
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
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
            req.flash("error", "Invalid email or password");
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
    errorMessage: req.flash("error"),
  });
};

const postSignUp = (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exist.");
        return res.redirect("/signup");
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
          return transporter.sendMail({
            to: email,
            from: "sayhanahmed5@gmail.com",
            subject: "Singup confirmation",
            html: "<h1>Sign Up Successfull</h1>",
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset | shop",
    path: "/reset",
    errorMessage: req.flash("error"),
  });
};

const postReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash("error", "Failed to create crypto random bytes");
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Please use a valid email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "sayhanahmed5@gmail.com",
          subject: "Reset Password",
          html: `
          <p>You requrested a password reset</p>
          <p>Click this link to <a href="http://localhost:5000/reset/${token}">reset</a> you password.</p>

          `,
        });
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", err.message);
      });
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
};
