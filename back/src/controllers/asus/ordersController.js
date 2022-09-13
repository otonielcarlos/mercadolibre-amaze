const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')

// async function sendProcessingOrdersToIM(req, res) {
//   const [data, error] = await usePromise(ordersService.sendProcessingOrders)
//   res.status(200).json(data)
// }

async function getAllAsusOrders(req, res) {
  const [data, error] = await usePromise(ordersService.getAsusInformationOrders)
  if(error) res.status(400).json(error)
  res.status(200).json(data)
}
async function getAllAsusOrdersFromDates(req, res) {
  const {from, to} = req.params
  // const [data, error] = await usePromise(ordersService.getAsusInformationOrders)
  const data = await ordersService.getAsusInformationOrdersFromDates(from, to)
  // console.log(data)
  res.status(200).json(data)
}

module.exports = {
  // sendProcessingOrdersToIM,
  getAllAsusOrders,
  getAllAsusOrdersFromDates
}