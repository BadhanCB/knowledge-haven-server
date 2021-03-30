const express = require('express');
const app = express();
const port = 1712;

app.get('/', (req, res) => {
  res.send('Welcome to NodeJS & ExpressJS world');
})

app.listen(port, () => console.log(`Listening to port ${port}`));