const { getOrdersFromLinioInDatabase } = require('../../database/linio/ordersDB')
const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/gopro/ordersService')
const {getOrdersFromGoProInDatabase} = require('../../database/gopro/ordersDB')

async function getOrderWithID(req, res) {
  try {
    const {order_id} = req.params
    console.log(order_id)
    const order = await getOrdersFromGoProInDatabase(order_id)
    res.status(200).json(order)
  } catch (error) {
    res.status(404).send({
      "message": "error"
    })
  }
}

async function sendProcessingOrdersToIM(req, res) {
  console.log(req.body)
  const [data, error] = await usePromise(ordersService.sendProcessingOrders)
  res.status(200).json(data)
}

async function getAllGoProOrdersFromDates(req, res) {
  const {from, to} = req.params 
  try {
    const data = await ordersService.getGoProOrders(from, to)
    res.status(200).json(data)
    
  } catch (error) {
    console.log(error)
  }
}

async function updateGoProOrderStatusFactura(req, res) {
  try {
    res.status(200).send()
    const {order_id} = req.body
    await ordersService.updateGoProOrderFactura(order_id)
  } catch (error) {
    
  }
}

module.exports = {
  sendProcessingOrdersToIM,
  getAllGoProOrdersFromDates,
  updateGoProOrderStatusFactura,
  getOrderWithID
}