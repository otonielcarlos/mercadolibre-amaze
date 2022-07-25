const express = require('express')
const cors = require('cors')
const app = express()
const {	getTickets } = require('./src/ML/db')
const { addOrder } = require('./src/ML/func')
const { sendMessage } = require('./src/ML/message')
const { setDisplay, showAll } = require('./src/ML/db')

const {isOrderInIngram} = require('./src/IngramFunctions/checkIngramOrder')
const { checkOrderStatusPaid } = require('./src/ML/checkOrderPaid')
const { findOrder, saveNewOrderID, getMercadolibreOrders } = require('./src/ML/db')
const { getDateOrder, getToday, getTodayAndYesterday } = require('./src/ML/date')
const path = require("path");
require('dotenv').config()
const { MERCADOLIBRE_USER_ID, 
				MULTIMARCAS_USER_ID, 
				MERCADOLIBRE_APPLICATION_ID, 
				MULTIMARCAS_APPLICATION_ID } = process.env
const log = console.log

app.use(express.static(path.join(__dirname, "build")));

app.use(cors())
app.use(express.json())
app.set('json spaces', 2)
const PORT = process.env.PORT || 4000

// @ts-ignore

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "index.html"))
// })

app.get('/mercadolibre', async (req, res) => {
	try {
		const {today, yesterday} = getTodayAndYesterday()
		const orders = await getMercadolibreOrders(today, yesterday)
		console.log('orders logged')
		res.status(200).json(orders)
	} catch (error) {
		console.log('error en /mercadolibre')
	}
})



app.get('/orderid/:id', async (req, res) => {
	let order = req.params.id
	try {	
		const isApple = req.params.id.includes('MLAPPLE')
		
		if(isApple){

		const id = order.slice(8)
		const orderRes = await addOrder(id, 'APPLE')
		console.log(orderRes)
		res.status(200).json(orderRes)
		
	} else {

			const id = order.slice(3)
			const orderRes = await addOrder(id, 'MULTIMARCAS')
			res.status(200).json(orderRes)
		}
	} catch (error) {
		log('error', error)
	}
})

app.post('/callbacks', async (req, res) => {
	res.status(200).send()
	try {
		const { resource, topic, user_id, application_id } = req.body

		if (topic === 'orders_v2') {
			console.log(resource, user_id)
			const account = (user_id.toString() === MERCADOLIBRE_USER_ID) ? 'APPLE' : 'MULTIMARCAS'
			let id = resource.slice(8, resource.length)
			let date = await getDateOrder(id, account)
			const {today} = getToday()
			
			if(today === date ){
				let isOrder = await findOrder(id)
				
				if (isOrder === 'undefined') {
					await saveNewOrderID(id)
					await sendMessage(id, account ,user_id)
					await addOrder(id, account)
					
				} else {
					log(req.body.resource, 'ya existe')
				}
		}	else {
			console.log('el pedido no es de hoy', id)
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

// app.get('/*', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'build/index.html'))
// })

app.listen(PORT, err => {
	if (err) {
		log('error listening',err)
	}
	log(`listening on port: ${PORT}`)

})

module.exports = app


