const express = require('express');
const app = express();
const cors = require('cors');
const port = 1712;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brit3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

client.connect(err => {
  const bookCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.BOOK_COLLECTION}`);
  console.log('MongoDB database Connected');
  client.close();
});

app.get('/', (req, res) => {
  res.send('Welcome to NodeJS & ExpressJS world');
})

app.listen(port, () => console.log(`Listening to port ${port}`));