import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();
const MongoClient = mongodb.MongoClient;

let Writer=null;

MongoClient.connect("mongodb://localhost:27017/writer-db", (err, db) => {
  if(!err) {
    Writer = db.collection('writers');
  }
});

router.get('/', function(req, res, next) {
  Writer.find().toArray((err,writers) => {
    res.status(200).send({data: writers});
  });
});

router.get('/page/:page', function(req, res, next) {
  const skip = req.params.page * 3;
  Writer.find().skip(skip).limit(3).toArray((err,writers) => {
    res.status(200).send({data: writers});
  });
});

router.get('/total', function(req, res, next) {
  Writer.find().count((err, count)=>{
    res.status(200).send({data: count});
  });
});

router.get('/:id', function(req,res,next){
  const id = new mongodb.ObjectID(req.params.id);
  Writer.findOne({_id: id} ,(err, writer) => {
    res.status(200).send({data: writer});
  });
});

router.get('/:id/books', function(req,res,next){
  const id = new mongodb.ObjectID(req.params.id);
  Writer.findOne({_id: id}, {books: true, _id: false},(err, books) => {
    res.status(200).send({data: books.books});
  });
});

router.post('/', function(req,res,next){
  let writer = {
    name: req.body.name,
    about: `Description about ${req.body.name} will be available soon. Meanwhile, continue reading about any other author please.`,
    short_desc: `There is no description provided about this author yet.`,
    total_books: 0,
    books: []
  };
  Writer.insert(writer, (err, result) => {
    writer = result.ops[0];
    res.status(201).send({data:writer});
  });
});

module.exports = router;
