import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();
const MongoClient = mongodb.MongoClient;

let Writer=null;

MongoClient.connect("mongodb://localhost:27017/writer-db", function(err, db) {
  if(!err) {
    Writer = db.collection('writers');
  }
});

router.get('/', function(req, res, next) {
  Writer.find().toArray(function(err,writers){
    res.status(200).send({data: writers});
  });
});

router.get('/:id', function(req,res,next){
  const id = new mongodb.ObjectID(req.params.id);
  Writer.findOne({_id: id} , function(err, writer){
    res.status(200).send({data: writer});
  });
});

router.get('/:id/books', function(req,res,next){
  const id = new mongodb.ObjectID(req.params.id);
  Writer.findOne({_id: id}, {books: true, _id: false},function(err, books){
    res.status(200).send({data: books.books});
  });
});

router.post('/new', function(req,res,next){
  let writer = req.body;
  writer.about = "";
  writer.short_desc = "";
  writer.total_books = 0;
  writer.books = [];
  Writer.insert(writer, function(err, result){
    writer = result.ops[0];
    res.status(201).send(writer);
  });
});

module.exports = router;
