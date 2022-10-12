const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/gopro/ordersService')

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
    const {order_id} = req.body
    // console.log(order_id)
    await ordersService.updateGoProOrderFactura(order_id)
  } catch (error) {
    
  }
}

module.exports = {
  sendProcessingOrdersToIM,
  getAllGoProOrdersFromDates,
  updateGoProOrderStatusFactura
}