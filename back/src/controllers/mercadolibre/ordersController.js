require('dotenv').config()
const {MERCADOLIBRE_USER_ID} = process.env
const ordersService = require('../../services/mercadolibre/ordersService')
const messageService = require('../../services/mercadolibre/messagesService')
const utils = require('../../database/utilsdate')

async function orderFromMercadolibreWithID (req, res) {
  const orderResponse = await ordersService.sendOrderToIngramWithId(req)
	res.set('Content-Type', 'application/json')
  res.status(200).json(orderResponse)
}


async function ordersFromMercadolibreToIM(req, res){
  res.status(200).json({"message": "recibido"})
	try {
		const { resource, topic, user_id } = req.body

		if (topic === 'orders_v2') {
			console.log(resource, user_id)
			const account = (user_id.toString() === MERCADOLIBRE_USER_ID) ? 'APPLE' : 'MULTIMARCAS'
			let id = resource.slice(8, resource.length)
			let date = await ordersService.getOrderDate(id, account)
			const {today} = utils.getToday()
			
			if(today === date ){
				let isOrder = await ordersService.findOrderWithID(id)
				
				if (isOrder === 'undefined') {
					await ordersService.saveOrderID(id)
					await messageService.sendNewOrderMessage(id, account ,user_id)
					const respo = await ordersService.sendOrderToIngram(id, account)
          console.log(respo)
					
					
				} else {
					console.log('el pedido ya existe', id)
				}
		}	else {
			console.log('el pedido no es de hoy', id)
		}
	} 
	} catch (error) {
		console.log(error)
	}
}

async function getAllOrdersFromMercadolibreApple(req, res){
  const orders = await ordersService.getAllOrders()
  res.json(orders)
}



module.exports = {
  orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple
}