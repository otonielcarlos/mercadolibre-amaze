const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { db } = require('./src/db');
// const { getOrders } = require('./src/func');
const { sendMessage } = require('./src/message');

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.post('/callbacks', async (req, res) => {
  try {
    const { resource, topic } = req.body;
    res.status(200).send();
    if (topic === 'orders_v2') {

      res.status(200).send();
      // let responseMessage = await sendMessage(resource);
      console.log('New Order Alert', req.body);
      // console.log(responseMessage);
    } else {
      res.status(200).send();
      console.log('sent status to another post different than an order', req.body);
    }
  } catch (error) {
    console.log(error); 
  }
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }
  console.log(`listening on port: ${PORT}`);
});

module.exports = app;
