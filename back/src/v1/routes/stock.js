const express = require('express')
const router = express.Router()
const {getAndUpdateStock, getUpdatedProducts} = require('../../controllers/mercadolibre/stockController')
const {getUpdatedProductsGoPro} = require('../../controllers/gopro/stockController')

// router.get('/update', getAndUpdateStock)
router.get('/', getUpdatedProducts)
router.get('/gopro', getUpdatedProductsGoPro)
module.exports = router