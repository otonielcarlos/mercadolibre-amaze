const {default: axios} = require('axios')
const express = require('express')
const router = express.Router()
const {getDelivery, completeDelivery} = require('../../controllers/beetrack/beetrackController')
const {getDeliveryUrbano} = require('../../controllers/urbano/urbanoController')

//BEETRACK
router.post('/beetrack/guide', getDelivery)
router.post('/beetrack/guide/complete', completeDelivery)

//URBANO

router.post('/urbano/guide', getDeliveryUrbano)
module.exports = router