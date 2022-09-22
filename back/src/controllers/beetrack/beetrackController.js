const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')

async function getDelivery(req, res) {


  // res.status(200).json(data)
  console.log(req.body)
}


module.exports = {
  getDelivery
}