const usePromise = require( "../../helpers/errorHandling")
const {sendOrderToIngramFalabella} = require('../../services/falabella/ordersService')


async function ordersFromFalabellaToIM(req, res){
  res.status(200).send()
  console.log(req.body)
  const orderId = req.body.payload.OrderId
  const [data, error] = await usePromise(sendOrderToIngramFalabella, orderId)

}

module.exports = {
  ordersFromFalabellaToIM
}