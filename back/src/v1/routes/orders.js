const express = require('express')
const router = express.Router()
const {orderFromMercadolibreAppleWithID,
  ordersFromMercadolibreAppleToIM} = require('../../controllers/ordersController')

router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreAppleWithID)

router.post('/mercadolibre/apple/', ordersFromMercadolibreAppleToIM)



module.exports = router