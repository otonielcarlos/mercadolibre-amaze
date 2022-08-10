const express = require('express')
const router = express.Router()
const {orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple} = require('../../controllers/mercadolibre/ordersController')

const ordersController = require('../../controllers/gopro/ordersController')

router.get('/mercadolibre/apple/orders', getAllOrdersFromMercadolibreApple)

router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

router.post('/mercadolibre/apple/', ordersFromMercadolibreToIM)

router.post('/gopro/orders', ordersController.sendProcessingOrdersToIM)

module.exports = router