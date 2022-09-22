
const {config} = require('dotenv')
config()
const express = require('express')
const cors = require('cors')
const app = express()
const path = require("path")
const v1Orders = require('./src/v1/routes/orders')
const v1Stock = require('./src/v1/routes/stock')
const PORT = process.env.PORT || 4000


app.use(express.static(path.join(__dirname, "build")))

app.use(cors())
app.use(express.json())
app.set('json spaces', 2)	

app.use("/pe/v1/orders", v1Orders)
app.use("/pe/v1/stock", v1Stock)	
app.use("/pe/v1/delivery", v1Stock)	

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


