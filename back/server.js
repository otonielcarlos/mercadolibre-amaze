
import {config} from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
const app = express()
import path from "path"
import v1Orders from './src/v1/routes/orders'
import v1Stock from './src/v1/routes/stock'
const PORT = process.env.PORT || 4000


app.use(express.static(path.join(__dirname, "build")))

app.use(cors())
app.use(express.json())

app.use("/pe/v1/orders", v1Orders)
app.use("/pe/v1/stock", v1Stock)	
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


