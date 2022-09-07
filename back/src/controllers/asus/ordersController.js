const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')

// async function sendProcessingOrdersToIM(req, res) {
//   const [data, error] = await usePromise(ordersService.sendProcessingOrders)
//   res.status(200).json(data)
// }

async function getAllAsusOrders(req, res) {
  const [data, error] = await usePromise(ordersService.getAsusOrders)
  res.status(200).json(data)
}

module.exports = {
  // sendProcessingOrdersToIM,  
  getAllAsusOrders
}