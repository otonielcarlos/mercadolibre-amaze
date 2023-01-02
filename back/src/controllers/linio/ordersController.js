const usePromise = require( "../../helpers/errorHandling")
const {sendOrderToIngramLinio, getOrdersFromLinio} = require('../../services/linio/ordersService')


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

module.exports = {
  ordersFromLinioToIM,
  allOrdersFromLinio
}