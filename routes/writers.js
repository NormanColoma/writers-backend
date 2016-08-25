import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();
const MongoClient = mongodb.MongoClient;

let Writer=null;

MongoClient.connect("mongodb://localhost:27017/writer-db", function(err, db) {
  if(!err) {
    Writer = db.collection('writers');
    console.log("We are connected");
  }
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  Writer.find().toArray(function(err,writers){
    console.log(writers);
    res.status(200).send(writers);
  });
});

module.exports = router;
