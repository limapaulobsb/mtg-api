const express = require('express');
const cors = require('cors');

const connect = require('./connection');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/v1/oracle', async (req, res) => {
  const { n } = req.query;
  const re = new RegExp(`^${n}$`, 'i');
  const conn = await connect();

  const { oracle_id: id } = await conn.collection('all').findOne({
    $or: [{ name: { $regex: re } }, { printed_name: { $regex: re } }],
  });

  return res.status(200).json({ id });
});

app.get('/api/v1/default/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await connect();

  const query = await conn
    .collection('default')
    .aggregate([
      {
        $match: {
          $or: [{ id }, { oracle_id: id }],
          digital: false,
        },
      },
      {
        $sort: {
          released_at: -1,
        },
      },
    ])
    .toArray();

  return res.status(200).json(query);
});

app.get('/api/v1/lang/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await connect();

  const query = await conn
    .collection('all')
    .aggregate([
      {
        $match: {
          oracle_id: id,
          printed_name: { $exists: true },
        },
      },
      {
        $group: {
          _id: { lang: '$lang', printed_name: '$printed_name' },
        },
      },
      {
        $project: {
          _id: 0,
          lang: '$_id.lang',
          printed_name: '$_id.printed_name',
        },
      },
      {
        $sort: {
          lang: 1,
        },
      },
    ])
    .toArray();

  return res.status(200).json(query);
});

app.get('/api/v1/rulings/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await connect();
  const query = await conn
    .collection('rulings')
    .find({ oracle_id: id, source: 'wotc' })
    .toArray();

  return res.status(200).json(query);
});

app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});
