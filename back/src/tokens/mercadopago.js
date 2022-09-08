
const {default: axios} = require('axios')
require('dotenv').config()
const {CLIENT_SECRET_MERCADOPAGO_GOPRO, CLIENT_ID_MERCADOPAGO_GOPRO, REFRESH_TOKEN_GOPRO} = process.env
const bodyGoPro = {
  "client_secret": CLIENT_SECRET_MERCADOPAGO_GOPRO,
  "client_id":CLIENT_ID_MERCADOPAGO_GOPRO,
  "grant_type": "refresh_token",
  "refresh_token": REFRESH_TOKEN_GOPRO
}

async function mercadopagoToken (isGoPro = true) {
	if(isGoPro){
		try {
			const tokenData = await axios.post('https://api.mercadopago.com/oauth/token', bodyGoPro, {
				headers: {
					Accept: 'application/json',
					'content-type': 'application/json',
				},
			})
			const token = tokenData.data.access_token
			return token
		} catch (error) {
			console.log(error.response)
		}
	} else {
	// 	try {
	// 		const tokenData = await axios.post('https://api.mercadolibre.com/oauth/token', bodyMultimarcas, {
	// 			headers: {
	// 				Accept: 'application/json',
	// 				'content-type': 'application/x-www-form-urlencoded',
	// 			},
	// 		})
	// 		const token = tokenData.data.access_token
	// 		console.log('token multimarcas')
	// 		return token
	// 	} catch (error) {
	// 		console.log(error.response)
	// 	}
	}	
}
module.exports = {mercadopagoToken}