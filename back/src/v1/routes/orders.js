const express = require('express')
const router = express.Router()
const {orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple} = require('../../controllers/mercadolibre/ordersController')

const {sendProcessingOrdersToIM, getAllGoProOrders} = require('../../controllers/gopro/ordersController')
const {getAllAsusOrders, getAllAsusOrdersFromDates} = require('../../controllers/asus/ordersController')
const {ordersFromLinioToIM} = require('../../controllers/linio/ordersController')

//GET TODOS LAS ORDENES MERCADOLIBRE
router.get('/mercadolibre/apple/all', getAllOrdersFromMercadolibreApple)

//ENVIAR ORDEN CON ID
router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

// CALLBACK DE MERCADOLIBRE ORDENES
router.post('/mercadolibre/apple', ordersFromMercadolibreToIM)

// CALLBACK LINIO ORDENES
router.post('/linio/new', ordersFromLinioToIM)

// WEBHOOK DE GOPRO   
router.post('/gopro/new', sendProcessingOrdersToIM)

//GET GOPRO ORDENES FROM INGRAM - WOOCOMMERCE - MERCADOPAGO
router.get('/gopro/all', getAllGoProOrders)

//GET ASUS ORDENES FROM INGRAM - WOOCOMMERCE - MERCADOPAGO
router.get('/asus/all', getAllAsusOrders)

router.get('/asus/all/:from/:to', getAllAsusOrdersFromDates)

module.exports = router