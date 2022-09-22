const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')

async function getDelivery(req, res) {
  try {
    console.log(req.body)
    
  } catch (error) {
    console.log('error en getDelivery Controller', error)
  }
}


module.exports = {
  getDelivery
}