async function orderFromMercadolibreAppleWithID (req, res) {
  res.send({message: `orderid is ${req.params.orderid}`})
}


async function ordersFromMercadolibreAppleToIM(req, res){
  res.send({"message": "order sent to ingram"})
}


module.exports = {
  orderFromMercadolibreAppleWithID,
  ordersFromMercadolibreAppleToIM
}