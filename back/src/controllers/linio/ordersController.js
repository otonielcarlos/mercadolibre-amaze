const usePromise = require( "../../helpers/errorHandling")
const {sendOrderToIngramLinio} = require('../../services/linio/ordersService')


async function ordersFromLinioToIM(req, res){
  const orderId = req.body.payload.OrderId
    const [data, error] = await usePromise(sendOrderToIngramLinio, orderId)
    if(error) res.status(500)
    res.status(200).json(data)
}

module.exports = {
  ordersFromLinioToIM
}