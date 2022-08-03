const express = require('express')
const router = express.Router()
const {ordersFromMercadolibreToIM, orderFromMercadolibreWithID} = require('../../controllers/ordersController')

router.get('/mercadolibre/:orderid', orderFromMercadolibreWithID)

router.post('/mercadolibre', ordersFromMercadolibreToIM)



module.exports = router