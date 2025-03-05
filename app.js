const express = require("express");
const bodyParder = require("body-parser");
const path = require("path");
require("dotenv").config();
const mongoes = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const PORT = process.env.PORT || 8000;
const { get404 } = require("./controllers/404.js");
const User = require("./models/user.js");

const adminRoute = require("./router/admin.js");
const shopRoute = require("./router/shop.js");
const authRoute = require("./router/auth.js");
const { get500 } = require("./controllers/500.js");

// const MONGODBURI = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@sayhan.fatp7.mongodb.net/shop?retryWrites=true&w=majority&appName=Sayhan`;
const MONGODBURI = "mongodb://localhost:27017/";

const app = express();

const store = new MongoDBStore({
  uri: MONGODBURI,
  collection: "session",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParder.urlencoded({ extended: false }));
app.use(multer({dest: 'images'}).single("image"));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  (res.locals.isAuthenticated = req.session.isLoggedIn),
    (res.locals.csrfToken = req.csrfToken()),
    next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  }
});

app.use("/admin", adminRoute);
app.use("/", shopRoute);
app.use("/", authRoute);

app.use("/500", get500);
app.use(get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", { pageTitle: "Error page", path: "/500" });
});

mongoes
  .connect(MONGODBURI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running on: http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(err));
