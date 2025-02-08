const express = require("express");
const bodyParder = require("body-parser");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const adminRoute = require("./router/admin.js");
const shopRoute = require("./router/shop.js");
const { get404 } = require("./controllers/404.js");
const User = require("./models/user.js");
const mongoes = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParder.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use("/admin", adminRoute);
app.use("/", shopRoute);

app.use(get404);

mongoes
  .connect(
    `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@sayhan.fatp7.mongodb.net/shop?retryWrites=true&w=majority&appName=Sayhan`
  )
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
