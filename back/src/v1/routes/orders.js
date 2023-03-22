const express = require('express')
const router = express.Router()

const { orderFromMercadolibreWithID,
  ordersFromMercadolibreToIM,
  getAllOrdersFromMercadolibreApple,
//   ordersFromMultiMarcasToIM 
    } = require('../../controllers/mercadolibre/ordersController')

const { sendProcessingOrdersToIM,
   getAllGoProOrdersFromDates,
   updateGoProOrderStatusFactura,
   getOrderWithID 
      } = require('../../controllers/gopro/ordersController')

const { getAllAsusOrders,
   getAllAsusOrdersFromDates,
   updateAsusOrderStatus,
   updateAsusOrderStatusFactura,
   sendProcessingOrdersAsusToIM
        } = require('../../controllers/asus/ordersController')

const { ordersFromLinioToIM,
    allOrdersFromLinio,
    getAllLinioOrdersFromDates,
    updateLinioOrderStatusFactura
 } = require('../../controllers/linio/ordersController')
const { ordersFromFalabellaToIM } = require('../../controllers/falabella/ordersController')
const { sendNewOrderXiaomi, getTrackingXiaomi } = require('../../controllers/xiaomi/ordersController')

//GET TODOS LAS ORDENES MERCADOLIBRE
router.get('/mercadolibre/apple/all', getAllOrdersFromMercadolibreApple)

//ENVIAR ORDEN CON ID
router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

// CALLBACK DE MERCADOLIBRE ORDENES
router.post('/mercadolibre/apple', ordersFromMercadolibreToIM)

// CALLBACK DE MERCADOLIBRE ORDENES
// router.post('/mercadolibre/multimarcas', ordersFromMultiMarcasToIM)

// CALLBACK LINIO ORDENES
router.post('/linio/new', ordersFromLinioToIM)

//GET ALL ORDERS LINIO
router.get('/linio/all', allOrdersFromLinio)

router.get('/linio/all/:from/:to', getAllLinioOrdersFromDates)

router.post('/linio/update/factura', updateLinioOrderStatusFactura)
//CALLBACK FALABELLA ORDENES
router.post('/falabella/new', ordersFromFalabellaToIM)

// WEBHOOK DE GOPRO   
router.get('/gopro/:order_id', getOrderWithID)

router.post('/gopro/new', sendProcessingOrdersToIM)

router.get('/gopro/all/:from/:to', getAllGoProOrdersFromDates)

router.post('/gopro/update/factura', updateGoProOrderStatusFactura)

router.post('/asus/new', sendProcessingOrdersAsusToIM)

//GET ASUS ORDENES FROM INGRAM - MAGENTO - MERCADOPAGO
router.get('/asus/all', getAllAsusOrders)

router.get('/asus/all/:from/:to', getAllAsusOrdersFromDates)

router.post('/asus/update', updateAsusOrderStatus)

router.post('/asus/update/factura', updateAsusOrderStatusFactura)


//XIAOMI

router.post('/xiaomi/new', sendNewOrderXiaomi)

router.get('/xiaomi/tracking/:customerpo', getTrackingXiaomi)


module.exports = router

