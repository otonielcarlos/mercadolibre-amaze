// const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const {
	saveNewOrderID,
	findOrder,
	saveIngram,
	getTickets,
} = require('./src/db');
const { addOrder } = require('./src/func');
const { sendMessage } = require('./src/message');
const { token } = require('./src/tokens/ml');
const { getDate } = require('./src/date');
const { sendMail } = require('./src/mailer');
const { setDisplay, showAll } = require('./src/db')
const log = console.log;

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
	res.status(200).send({ status: 'OK' });
});

app.get('/orderid/:id', async (req, res) => {
	try {
		let id = req.params.id;
		let orderRes = await addOrder(id);
		let nvID = orderRes.globalorderid;
		let customerPO = orderRes.customerPO;
		let trackingNumber = orderRes.trackingNumber;
		await saveIngram(nvID, customerPO, trackingNumber, id);
		log('id guardado con éxito ', id);
		log('Customerponumber: ', customerPO, 'nv', nvID);
		res.status(200).json(orderRes);
	} catch (error) {
		log(error);
	}
});

app.post('/callbacks', async (req, res) => {
	res.status(200).send();
	console.log(req.body)
	try {
		const { resource, topic } = req.body;
		if (topic === 'orders_v2') {
      log(req.body)
			const saveDate = new Date();
			saveDate.setHours(saveDate.getHours() - 5);
			let today = saveDate.toISOString().split('T')[0];
			let orderDate = await getDate(resource);
			let id = resource.slice(8, resource.length);
			if (today === orderDate) {
				let isOrder = await findOrder(id);

				if (isOrder === 'undefined') {
					await sendMessage(resource);
					await saveNewOrderID(id);
					let orderRes = await addOrder(id);
					log(orderRes);
					let nvID = orderRes.globalorderid;
					let customerPO = orderRes.customerPO;
					let trackingNumber = orderRes.trackingNumber;
					if (typeof nvID === 'undefined') {
						sendMail(id);
					}
					await saveIngram(nvID, customerPO, trackingNumber, id);
					log('id guardado con éxito ', id);
					log('Customerponumber: ', customerPO, 'nv', nvID);
					// log(orderRes.serviceresponse.ordersummary.ordercreateresponse[0]);
				} else {
					log('id ya existe ', isOrder);
				}
			} else {
				log('hoy es ', today, ' y el pedido es del ', orderDate);
			}
		} else {
			// log('callback de', req.body.topic);
		}
	} catch (error) {
		log(error);
	}
});

app.get('/guias', async (req, res) => {
	try {
		const guias = await getTickets();
		for (let i in guias) {
			let guia = guias[i].fecha.toISOString();
			guias[i].fecha = guia.split('T')[0];
		}
		res.status(200).json(guias);
	} catch (error) {
		log(error);
	}
});

app.get('/todos', async (req, res) => {
  try {
    const results = await showAll();
    for(let i in results){
      let result = results[i].fecha.toISOString();
      results[i].fecha = result.split('T')[0];
    }
    res.status(200).json(results)
  } catch (error) {
    log(error)
    res.status(404).json(
      {
        "error": "something went wrong",
        "data": error
      }
    );
  }
})

app.delete('/borrar/:guia', async (req, res) => {
  try {
    const { guia } = req.params
    const result = await setDisplay(guia);
    if(result === 1) {
      log(guia);
      res.status(202).json({"message": `guia ${ guia } eliminada con éxito`})
    } else {
      res.status(404).json({"message": `guia ${guia} not found`})
    } 
  } catch (error) {
    log(error)
  }
})

app.listen(PORT, err => {
	if (err) {
		log('error listening',err);
	}
	log(`listening on port: ${PORT}`);
});

module.exports = app;
