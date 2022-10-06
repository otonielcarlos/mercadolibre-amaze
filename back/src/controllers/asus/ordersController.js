const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')
const {statusUpdateAsus} = require('../../services/asus/statusUpdateAsus')

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
    // const isUpdated = await statusUpdateAsus({order: order_id, status: 'InvoiceUploaded', comment: ''})
    // return isUpdated.data
  } catch (error) {
    console.log(error, 'error updating factura status')
  }
}

module.exports = {
  updateAsusOrderStatusFactura,
  updateAsusOrderStatus,
  getAllAsusOrders,
  getAllAsusOrdersFromDates
}