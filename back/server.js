const express = require('express')
const cors = require('cors')
const app = express()
const {	getTickets } = require('./src/ML/db')
const { addOrder } = require('./src/ML/func')
const { sendMessage } = require('./src/ML/message')
const { setDisplay, showAll } = require('./src/ML/db')
const {isOrderInIngram} = require('./src/IngramFunctions/checkIngramOrder')
const { checkOrderStatusPaid } = require('./src/ML/checkOrderPaid')
const { findOrder, saveNewOrderID } = require('./src/ML/db')
const { getDateOrder, getToday } = require('./src/ML/date')
const path = require("path");
require('dotenv').config()
const log = console.log

app.use(express.static(path.join(__dirname, "build")));

app.use(cors())
app.use(express.json())
app.set('json spaces', 2)
const PORT = process.env.PORT || 4000

// @ts-ignore
app.get('/', (req, res) => {
	res.status(200).send({ status: 'OK' })
	console.log({status: 'OK'})
})

app.get('/orderid/:id', async (req, res) => {
	try {	
		let order = req.params.id
		let id = order.slice(8)
		const orderRes = await addOrder(id)
		res.status(200).json(orderRes)
	} catch (error) {
		log('error',error)
	}
})

app.post('/callbacks', async (req, res) => {
	res.status(200).send()
	try {
		const { resource, topic } = req.body

		if (topic === 'orders_v2') {
			
			let id = resource.slice(8, resource.length)
			let date = await getDateOrder(id)
			const {today} = getToday()
			if(today === date ){
			let isOrder = await findOrder(id)
			if (isOrder === 'undefined') {
				await saveNewOrderID(id)
				await sendMessage(id)
				await addOrder(id)
				
			} else {
				log(req.body.resource, 'ya existe')
			}
		}	else {
			console.log('id ya existe', id)
		}
	} 
	} catch (error) {
		log(error)
	}
})

// @ts-ignore
app.get('/guias', async (req, res) => {
	try {
		const guias = await getTickets()
		for (let i in guias) {
			let guia = guias[i].fecha.toISOString()
			guias[i].fecha = guia.split('T')[0]
		}
		res.status(200).json(guias)
	} catch (error) {
		log(error)
	}
})

// @ts-ignore
app.get('/todos', async (req, res) => {
  try {
    const results = await showAll()
    for(let i in results){
      let result = results[i].fecha.toISOString()
      results[i].fecha = result.split('T')[0]
    }
    res.status(200).json(results)
  } catch (error) {
    log(error)
    res.status(404).json(
      {
        "error": "something went wrong",
        "data": error
      }
    )
  }
})

app.delete('/borrar/:guia', async (req, res) => {
  try {
    const { guia } = req.params
    const result = await setDisplay(guia)
    if(result === 1) {
      log(guia)
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
		log('error listening',err)
	}
	log(`listening on port: ${PORT}`)
})

module.exports = app
