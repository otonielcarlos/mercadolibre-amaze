const {default: axios} = require('axios')
const express = require('express')
const router = express.Router()
const {getDelivery} = require('../../controllers/beetrack/beetrackController')

router.post('/guide', getDelivery)

module.exports = router