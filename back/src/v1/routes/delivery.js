const {default: axios} = require('axios')
const express = require('express')
const router = express.Router()
const {getDelivery, completeDelivery} = require('../../controllers/beetrack/beetrackController')

router.post('/guide', getDelivery)
router.post('/guide/complete', completeDelivery)

module.exports = router