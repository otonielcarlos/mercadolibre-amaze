const express = require('express')
const cors = require('cors')
const app = express()

const path = require("path");
require('dotenv').config()
const v1OrdersMercadolibre = require('./src/v1/routes/orders')
const v1OrdersGoPro = require('./src/v1/routes/gopro/orders')
const v1Stock = require('./src/v1/routes/stock')
const PORT = process.env.PORT || 4000


app.use(express.static(path.join(__dirname, "build")));

app.use(cors())
app.use(express.json())

app.use("/pe/v1/orders", v1OrdersMercadolibre)
app.use("/pe/v1/stock", v1Stock)
app.use
app.set('json spaces', 2)

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.listen(PORT, err => {
	if (err) {
		console.log('error listening',err)
	}
	console.log(`listening on port: ${PORT}`)
})

module.exports = app


