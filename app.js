const express = require("express");
const bodyParder = require("body-parser");
const path = require("path");
require("dotenv").config();
const mongoes = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const PORT = process.env.PORT || 8000;
const { get404 } = require("./controllers/404.js");
const User = require("./models/user.js");

const adminRoute = require("./router/admin.js");
const shopRoute = require("./router/shop.js");
const authRoute = require("./router/auth.js");

const MONGODBURI = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@sayhan.fatp7.mongodb.net/shop?retryWrites=true&w=majority&appName=Sayhan`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODBURI,
  collection: "session",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParder.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
});

app.use("/admin", adminRoute);
app.use("/", shopRoute);
app.use("/", authRoute);

app.use(get404);

mongoes
  .connect(MONGODBURI)
  .then(() => {
    User.find()
      .then((result) => {
        User.findOne().then((user) => {
          if (!user) {
            const user = new User({
              name: "user",
              email: "user@test.com",
              cart: { items: [] },
            });
            user.save();
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });

    app.listen(PORT, () =>
      console.log(`Server is running on: http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(err));
