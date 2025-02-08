const { MongoClient } = require("mongodb");

// user: node
// password: 8Pilq7SLLimY0Szs

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@sayhan.fatp7.mongodb.net/test?retryWrites=true&w=majority&appName=Sayhan`
  )
    .then((client) => {
      console.log("Database connected"); 
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;