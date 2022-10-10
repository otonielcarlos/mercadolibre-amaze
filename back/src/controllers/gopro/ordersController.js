const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/gopro/ordersService')

async function sendProcessingOrdersToIM(req, res) {
  const [data, error] = await usePromise(ordersService.sendProcessingOrders)
  res.status(200).json(data)
}

async function getAllGoProOrdersFromDates(req, res) {
  const {from, to} = req.params 
  try {
    const data = await ordersService.getGoProOrders(from, to)
    console.log(data)
    // const [data, error] = await usePromise(ordersService.getGoProOrders)
    res.status(200).json(data)
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendProcessingOrdersToIM,
  getAllGoProOrdersFromDates
}