const express = require('express')
const router = express.Router()
const {orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple} = require('../../../controllers/mercadolibre/ordersController')

router.get('/mercadolibre/apple/orders', getAllOrdersFromMercadolibreApple)

router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

router.post('/mercadolibre/apple/', ordersFromMercadolibreToIM)



module.exports = router