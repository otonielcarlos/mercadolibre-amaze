const express = require('express')
const router = express.Router()

const { orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple 
    } = require('../../controllers/mercadolibre/ordersController')

const { sendProcessingOrdersToIM,
   getAllGoProOrdersFromDates,
   updateGoProOrderStatusFactura 
      } = require('../../controllers/gopro/ordersController')

const { getAllAsusOrders,
   getAllAsusOrdersFromDates,
   updateAsusOrderStatus,
   updateAsusOrderStatusFactura,
   sendProcessingOrdersAsusToIM
        } = require('../../controllers/asus/ordersController')

const { ordersFromLinioToIM } = require('../../controllers/linio/ordersController')
const { ordersFromFalabellaToIM } = require('../../controllers/falabella/ordersController')
const { sendNewOrderXiaomi } = require('../../controllers/xiaomi/ordersController')

//GET TODOS LAS ORDENES MERCADOLIBRE
router.get('/mercadolibre/apple/all', getAllOrdersFromMercadolibreApple)

//ENVIAR ORDEN CON ID
router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

// CALLBACK DE MERCADOLIBRE ORDENES
router.post('/mercadolibre/apple', ordersFromMercadolibreToIM)

// CALLBACK LINIO ORDENES
router.post('/linio/new', ordersFromLinioToIM)

//CALLBACK FALABELLA ORDENES
router.post('/falabella/new', ordersFromFalabellaToIM)

// WEBHOOK DE GOPRO   
router.post('/gopro/new', sendProcessingOrdersToIM)

router.get('/gopro/all/:from/:to', getAllGoProOrdersFromDates)

router.post('/gopro/update/factura', updateGoProOrderStatusFactura)

router.post('/asus/new', sendProcessingOrdersAsusToIM)

//GET ASUS ORDENES FROM INGRAM - MAGENTO - MERCADOPAGO
router.get('/asus/all', getAllAsusOrders)

router.get('/asus/all/:from/:to', getAllAsusOrdersFromDates)

router.post('/asus/update', updateAsusOrderStatus)

router.post('/asus/update/factura', updateAsusOrderStatusFactura)

router.post('/xiaomi/new', sendNewOrderXiaomi)

module.exports = router

