const usePromise = require( "../../helpers/errorHandling")
const {sendOrderToIngramLinio, getOrdersFromLinio, linioOrdersFromDates, updateOrderStatusFactura } = require('../../services/linio/ordersService')


async function ordersFromLinioToIM(req, res){
  res.status(200).send()
  const orderId = req.body.payload.OrderId
  const [data, error] = await usePromise(sendOrderToIngramLinio, orderId)
  if(error) res.status(500)
}

async function allOrdersFromLinio(req, res) {
  try {
    const allOrders = await getOrdersFromLinio()
    // console.log(allOrders)
    res.status(200).json(allOrders)
  } catch (error) {
    console.log(error)
  }
}

async function getAllLinioOrdersFromDates(req, res) {
  try {
    const {from, to} = req.params
    const orders = await linioOrdersFromDates(from, to)
    res.status(200).json(orders)
  } catch (error) {
    
  }
}

async function updateLinioOrderStatusFactura(req, res) {
  try {
    res.status(200).send()
    const {order_id} = req.body
    console.log(req.body, order_id)
    await updateOrderStatusFactura(order_id)
    
  } catch (error) {
    console.log(error, 'error updating factura status')
  }
}

module.exports = {
  ordersFromLinioToIM,
  allOrdersFromLinio,
  getAllLinioOrdersFromDates,
  updateLinioOrderStatusFactura
}