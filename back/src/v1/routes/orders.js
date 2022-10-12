const express = require('express')
const router = express.Router()
const {orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple} = require('../../controllers/mercadolibre/ordersController')

const {sendProcessingOrdersToIM, getAllGoProOrdersFromDates, updateGoProOrderStatusFactura} = require('../../controllers/gopro/ordersController')
const { getAllAsusOrders, getAllAsusOrdersFromDates, updateAsusOrderStatus, updateAsusOrderStatusFactura } = require('../../controllers/asus/ordersController')
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
// router.get('/gopro/all', getAllGoProOrders)

router.get('/gopro/all/:from/:to', getAllGoProOrdersFromDates)

router.post('/gopro/update/factura', updateGoProOrderStatusFactura)

//GET ASUS ORDENES FROM INGRAM - MAGENTO - MERCADOPAGO
router.get('/asus/all', getAllAsusOrders)

router.get('/asus/all/:from/:to', getAllAsusOrdersFromDates)

router.post('/asus/update', updateAsusOrderStatus)

router.post('/asus/update/factura', updateAsusOrderStatusFactura)

module.exports = router