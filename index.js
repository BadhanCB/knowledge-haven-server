const express = require('express');
const app = express();
const cors = require('cors');
const port = 1712;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brit3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

client.connect(err => {
  const bookCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.BOOK_COLLECTION}`);
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.ORDER_COLLECTION}`);

  app.post('/addBook', (req, res) => {
    bookCollection.insertOne(req.body)
    .then((result) => {
      const count = result.insertedCount;
      res.send(count > 0);
    })
  })

  app.get('/allBooks', (req, res) => {
    bookCollection.find({}).toArray((err, documents) => res.send(documents));
  })

  app.get('/productDetails/:id', (req, res) => {
    bookCollection.findOne({_id: ObjectId(req.params.id)})
    .then(document => res.send(document));
  })

  app.post('/orderBook', (req, res) => {
    orderCollection.insertOne(req.body)
    .then((result) => {
      const count = result.insertedCount;
      res.send(count > 0);
    })
  })

  app.get('/submitedOrders/:email', (req, res) => {
    orderCollection.find({buyerEmail: req.params.email})
    .toArray((err, documents) => res.send(documents));
  })

  app.get('/addedBooks/:email', (req, res) => {
    bookCollection.find({userEmail: req.params.email})
    .toArray((err, documents) => res.send(documents));
  })

  app.delete('/deleteBook/:id', (req, res) => {
    bookCollection.deleteOne({
      _id: ObjectId(req.params.id),
    }).then(result => {
      const count = result.deletedCount;
      res.send(count > 0);
    })
  })

  app.patch('/updateBook/:id', (req, res) => {
    const {name, author, price} = req.body;
    bookCollection.updateOne(
      {_id: ObjectId(req.params.id)},
      {
        $set: {
          name: name,
          author: author,
          price: price,
        }
      }
    ).then(result => {
      res.send(result.modifiedCount > 0);
    })
  })

});

app.get('/', (req, res) => {
  res.send('Welcome to NodeJS & ExpressJS world');
})

app.listen( process.env.PORT || port);