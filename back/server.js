const express = require('express')
const cors = require('cors')
const app = express()
const { addOrder } = require('./src/ML/func')

const path = require("path");
require('dotenv').config()
const { MERCADOLIBRE_USER_ID } = process.env
const log = console.log
const v1Orders = require('./src/v1/routes/orders')

app.use(express.static(path.join(__dirname, "build")));


app.use(cors())
app.use(express.json())
app.use("/pe/v1/orders", v1Orders)
app.set('json spaces', 2)
const PORT = process.env.PORT || 4000



app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.listen(PORT, err => {
	if (err) {
		log('error listening',err)
	}
	log(`listening on port: ${PORT}`)

})

module.exports = app


