const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')
const { statusUpdateAsus } = require('../../services/asus/statusUpdateAsus')

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

async function updateAsusOrderStatus(req, res) {
  try {
    res.status(200).send()
    const {order, status} = req.body
    await statusUpdateAsus({order, status, comment: '', notify: 0})
  } catch (error) {
    console.log(error, 'error updating status')
  }
}
async function updateAsusOrderStatusFactura(req, res) {
  try {
    res.status(200).send()
    const {order_id} = req.body
    console.log(req.body, order_id)
    await ordersService.updateAsusOrderStatusFactura(order_id)
    
  } catch (error) {
    console.log(error, 'error updating factura status')
  }
}

async function sendProcessingOrdersAsusToIM(req, res) {
  try {
    res.status(200).send('OK')
    console.log(req.body)
    await ordersService.sendAsusIdToIngram(req.body.order_id)
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateAsusOrderStatusFactura,
  updateAsusOrderStatus,
  getAllAsusOrders,
  getAllAsusOrdersFromDates,
  sendProcessingOrdersAsusToIM
}