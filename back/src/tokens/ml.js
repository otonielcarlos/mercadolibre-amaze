const { default: axios } = require('axios')
require('dotenv').config()
const {MERCADOLIBRE_CLIENT_ID, MERCADOLIBRE_CLIENT_SECRET, MERCADOLIBRE_REFRESH_TOKEN, MERCADOLIBRE_REDIRECT_URI} = process.env
const log = console.log

const body = {
	"grant_type": "refresh_token",
	"client_id": MERCADOLIBRE_CLIENT_ID,
	"client_secret": MERCADOLIBRE_CLIENT_SECRET,
	"refresh_token": MERCADOLIBRE_REFRESH_TOKEN
}

const body_1 = {
	grant_type: 'authorization_code',
	client_id: MERCADOLIBRE_CLIENT_ID,
	client_secret: MERCADOLIBRE_CLIENT_SECRET,
	code: '',
	redirect_uri: MERCADOLIBRE_REDIRECT_URI,
}

const token = async () => {
	// @ts-ignore
	try {
		const tokenData = await axios.post('https://api.mercadolibre.com/oauth/token', body, {
			headers: {
				Accept: 'application/json',
				'content-type': 'application/x-www-form-urlencoded',
			},
		})
		// console.log(tokenData.data)
		const token = tokenData.data.access_token
		return token
	} catch (error) {
		console.log(error.response)
	}
	
}
	
module.exports = {
	token,
}
