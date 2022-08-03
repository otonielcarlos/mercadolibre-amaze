const express = require('express')
const router = express.Router()
const {ordersFromMercadolibreToIM, orderFromMercadolibreWithID} = require('../../controllers/ordersController')

router.get('/:orderid', orderFromMercadolibreWithID)

router.post('/', ordersFromMercadolibreToIM)



module.exports = router