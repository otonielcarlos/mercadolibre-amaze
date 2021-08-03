const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { db, saveNewOrderID, findOrder } = require('./src/db');
const { addOrder } = require('./src/func');
const { sendMessage } = require('./src/message');
const { token } = require('./src/ml');
const { getDate } = require('./src/date');
const { sendMail } = require('./src/mailer');

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.status(200).send({ status: 'OK' });
});

app.post('/callbacks', async (req, res) => {
  res.status(200).send(req.body);
  try {
    const { resource, topic } = req.body;
    if (topic === 'orders_v2') {
      const saveDate = new Date();
      saveDate.setHours(saveDate.getHours() - 5);
      let today = saveDate.toISOString().split('T')[0];
      let orderDate = await getDate(resource); 
      if (today === orderDate) {
        // let id = resource.slice(7, resource.length);
        let id = resource.split('/', resource.length)[1];
        let isOrder = await findOrder(id);
        if (isOrder === 'undefined') {
          let responseMessage = await sendMessage(resource);
          await saveNewOrderID(id);
          await sendMail(id)
          // console.log(responseMessage);
          console.log('id guardado con éxito ', id);
        } else {
          console.log('id ya existe ', isOrder);
        }
      } else {
        console.log(
          'hoy es ', 
          today, 
          ' y el pedido es del ', 
          orderDate);
      }
    } else {
      console.log(
        'sent status to another post different than an order',
        req.body
      );
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
