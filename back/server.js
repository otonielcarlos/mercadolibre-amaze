const express = require('express')
const cors = require('cors')
const app = express()
const {	getTickets } = require('./src/ML/db')
const { addOrder } = require('./src/ML/func')
const { sendMessage } = require('./src/ML/message')
const { setDisplay, showAll } = require('./src/ML/db')
const { findOrder, saveNewOrderID, getMercadolibreOrders } = require('./src/ML/db')
const { getDateOrder, getToday, getTodayAndYesterday } = require('./src/ML/date')
const path = require("path");
require('dotenv').config()
const { MERCADOLIBRE_USER_ID } = process.env
const log = console.log
const v1Orders = require('./src/v1/routes/orders')

app.use(express.static(path.join(__dirname, "build")));


app.use(cors())
app.use(express.json())
app.use("/api/v1/orders", v1Orders)
app.set('json spaces', 2)
const PORT = process.env.PORT || 4000

// @ts-ignore

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "index.html"))
// })





app.get('/orderid/:id', async (req, res) => {
	
})

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


app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.listen(PORT, err => {
	if (err) {
		log('error listening',err)
	}
	log(`listening on port: ${PORT}`)

})

module.exports = app


