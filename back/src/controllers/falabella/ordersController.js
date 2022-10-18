const usePromise = require( "../../helpers/errorHandling")
const {sendOrderToIngramFalabella} = require('../../services/falabella/ordersService')


async function ordersFromFalabellaToIM(req, res){
  res.status(200).send()
  const orderId = req.body.payload.OrderId
  const [data, error] = await usePromise(sendOrderToIngramFalabella, orderId)
  if(error) res.status(500)
}

module.exports = {
  ordersFromFalabellaToIM
}