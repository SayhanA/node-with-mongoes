const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

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
    errorMessage: [],
    values: { email: "", password: "" },
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const validationError = validationResult(req);
  console.log("validation error from post login: ", validationError.array());

  if (validationError.isEmpty()) {
    return User
      .findOne({ email })
      .then((user) => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          console.log(err);
          return res.redirect("/");
        });
      });
  }

  res.render("auth/login", {
    pageTitle: "Login | shop",
    path: "/login",
    isAuthenticated: false,
    errorMessage: validationError.array(),
    values: req.body,
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
    oldInput: { name: "", email: "", password: "", confirm_password: "" },
    validationError: [],
  });
};

const postSignUp = (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;
  const validationError = validationResult(req);
  console.log(validationError.array());

  if (!validationError.isEmpty()) {
    return res.status(422).render("auth/signUp", {
      pageTitle: "SignUp | shop",
      path: "/signup",
      isAuthenticated: false,
      errorMessage: validationError.array()[0].msg,
      oldInput: req.body,
      validationError: validationError.array(),
    });
  }

  bcrypt
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
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    console.log("Getting token from post reset token request:   ", token);

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
        res.redirect(`/newPassword/${token}`);
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

const getNewPassword = (req, res, next) => {
  const resetToken = req.params.token;

  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      console.log(user);
      res.render("auth/newPassword", {
        pageTitle: "New password | shop",
        path: "newPassword",
        errorMessage: req.flash("error"),
        userId: user._id.toString(),
        resetToken,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postNewPassword = (req, res, next) => {
  const { userId, resetToken, newPassword, confirmNewPassword } = req.body;
  let updateUser;

  if (newPassword !== confirmNewPassword) {
    req.flash(
      "error",
      "Please make sure new password and confirm new password are same"
    );
    return res.redirect(`/newPassword/${resetToken}`);
  }

  User.findOne({
    _id: userId,
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      updateUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      updateUser.resetToken = undefined;
      updateUser.resetTokenExpiration = undefined;
      updateUser.password = hashedPassword;
    })
    .then(() => {
      updateUser.save();
      return res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  getNewPassword,
  postNewPassword,
};
