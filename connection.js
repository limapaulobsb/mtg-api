const mongodb = require('mongodb').MongoClient;

module.exports = () => mongodb.connect('mongodb://localhost:27017/mtg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db('mtg'))
  .catch((err) => {
    console.error(err);
  });
