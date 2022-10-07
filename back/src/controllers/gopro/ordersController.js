const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/gopro/ordersService')

async function sendProcessingOrdersToIM(req, res) {
  console.log(req.body)
  const [data, error] = await usePromise(ordersService.sendProcessingOrders)
  res.status(200).json(data)
}

// async function getAllGoProOrders(req, res) {
//   const [data, error] = await usePromise(ordersService.getGoProOrders)
//   res.status(200).json(data)
// }


module.exports = {
  sendProcessingOrdersToIM,
  // getAllGoProOrders
}