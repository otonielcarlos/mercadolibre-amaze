async function orderFromMercadolibreWithID (req, res) {
  res.send({message: `orderid is ${req.params.orderid}`})
}


async function ordersFromMercadolibreToIM(req, res){
  res.send({"message": "order sent to ingram"})
}


module.exports = {
  ordersFromMercadolibreToIM,
  orderFromMercadolibreWithID
}