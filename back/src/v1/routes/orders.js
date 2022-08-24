const express = require('express')
const router = express.Router()
const {orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple} = require('../../controllers/mercadolibre/ordersController')

const {sendProcessingOrdersToIM} = require('../../controllers/gopro/ordersController')
const {ordersFromLinioToIM} = require('../../controllers/linio/ordersController')

//GET TODOS LAS ORDENES
router.get('/mercadolibre/apple/all', getAllOrdersFromMercadolibreApple)

//ENVIAR ORDEN CON ID
router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

// CALLBACK DE MERCADOLIBRE ORDENES
router.post('/mercadolibre/apple', ordersFromMercadolibreToIM)

// CALLBACK LINIO ORDENES
router.post('/linio/new', ordersFromLinioToIM)

// WEBHOOK DE GOPRO   
router.post('/gopro/new', sendProcessingOrdersToIM)

module.exports = router