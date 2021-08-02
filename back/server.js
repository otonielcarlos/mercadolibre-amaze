const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { db, saveNewOrderID, findOrder } = require('./src/db');
const { addOrder } = require('./src/func');
const { sendMessage } = require('./src/message');

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.status(200).send({"status": "OK"});
})

app.post('/callbacks', async (req, res) => {
  try {
    const { resource, topic } = req.body;
    if (topic === "orders_v2") {

      res.status(200).send(req.body);
      // let responseMessage = await sendMessage(resource);
      let id = resource.slice(8, resource.length);
      let isOrder = await findOrder(id);
       if(isOrder === 'undefined'){
        // addOrder(id)
       await saveNewOrderID(id)
       console.log('id guardado con éxito ', id);
      } else {
          console.log('id ya existe ', id);
        }
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
