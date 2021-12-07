const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { saveNewOrderID, findOrder, saveIngram, getTickets } = require('./src/db');
const { addOrder } = require('./src/func');
const { sendMessage } = require('./src/message');
const { token } = require('./src/ml');
const { getDate } = require('./src/date');
const { sendMail } = require('./src/mailer')

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
      let idResource = resource.slice(8, resource.length);
      let id = idResource;
      if (today === orderDate) {
        let isOrder = await findOrder(id);

        if (isOrder === 'undefined') {
          await sendMessage(resource);
          await saveNewOrderID(id);
          let orderRes = await addOrder(id);
          console.log(orderRes);
          let nvID = orderRes.globalorderid ;
          let customerPO = orderRes.customerPO;
          let trackingNumber = orderRes.trackingNumber;
          if(typeof nvID === "undefined"){
            sendMail(id);
          }
          await saveIngram(nvID , customerPO, trackingNumber, id)
          console.log('id guardado con éxito ', id);
          console.log('Customerponumber: ', customerPO, 'nv', nvID)
          // console.log(orderRes.serviceresponse.ordersummary.ordercreateresponse[0]);
          
        } else {
          console.log('id ya existe ', isOrder);
        }
      } else {
        console.log('hoy es ', today, ' y el pedido es del ', orderDate);
      }
    } else {
      // console.log('callback de', req.body.topic);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get('/guias', async(req,res) => {
  try {
    const guias = await getTickets();
    res.status(200).json(guias);
    
  } catch (error) {
    console.log(error);
  }
})

app.post('/orderid/:id',(req,res) => {

  try {
    const { resource, topic } = req.body;
      const saveDate = new Date();
      saveDate.setHours(saveDate.getHours() - 5);
      let today = saveDate.toISOString().split('T')[0];
      let orderDate = await getDate(resource);
      let idResource = resource.slice(8, resource.length);
      let id = req.params.id;
    
          let orderRes = await addOrder(id);
          console.log(orderRes);
          let nvID = orderRes.globalorderid ;
          let customerPO = orderRes.customerPO;
          let trackingNumber = orderRes.trackingNumber;
          await saveIngram(nvID , customerPO, trackingNumber, id)
          console.log('id guardado con éxito ', id);
          console.log('Customerponumber: ', customerPO, 'nv', nvID)
          
        // } else {
        //   console.log('id ya existe ', isOrder);
        // }
      // } else {
      //   console.log('hoy es ', today, ' y el pedido es del ', orderDate);
      // }
  } catch (error) {
    console.log(error);
  }
})

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }
  console.log(`listening on port: ${PORT}`);
});

module.exports = app;
