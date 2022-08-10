const express = require('express')
const router = express.Router()
const {getAndUpdateStock, getUpdatedProducts} = require('../../controllers/stockController')

// router.get('/update', getAndUpdateStock)
router.get('/', getUpdatedProducts)

module.exports = router