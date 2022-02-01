const express = require('express');
const cors = require('cors');

const connect = require('./connection');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/', async (_req, res) => {
  const conn = await connect();
  const query = await conn.collection('allCards').find().limit(50).toArray();
  return res.status(200).json(query);
});

app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});
