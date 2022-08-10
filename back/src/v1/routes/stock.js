const express = require('express')
const router = express.Router()

router.get('/update', (req, res) => {
  res.send({"message": "working"})
})

module.exports = router