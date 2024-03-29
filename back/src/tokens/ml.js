const { default: axios } = require('axios')
require('dotenv').config()
const { MERCADOLIBRE_CLIENT_ID, 
	MERCADOLIBRE_CLIENT_SECRET, 
	MERCADOLIBRE_REFRESH_TOKEN, 
	MERCADOLIBRE_REDIRECT_URI, 
	MULTIMARCAS_CLIENT_ID,
	MULTIMARCAS_CLIENT_SECRET,
	MULTIMARCAS_REFRESH_TOKEN } = process.env
const log = console.log

const bodyApple = {
	"client_secret": MERCADOLIBRE_CLIENT_SECRET,
	"client_id": MERCADOLIBRE_CLIENT_ID,
	"grant_type": "refresh_token",
	"refresh_token": MERCADOLIBRE_REFRESH_TOKEN
}

const bodyMultimarcas = {
	"client_secret": MULTIMARCAS_CLIENT_SECRET,
	"client_id": MULTIMARCAS_CLIENT_ID,
	"grant_type": "refresh_token",
	"refresh_token": MULTIMARCAS_REFRESH_TOKEN
}

const body_1 = {
	"grant_type": "authorization_code",
	"client_id": "MERCADOLIBRE_CLIENT_ID",
	"client_secret": "MERCADOLIBRE_CLIENT_SECRET",
	"code": "",
	"redirect_uri": "MERCADOLIBRE_REDIRECT_URI",
}



async function token (isApple = true) {
	// const isApple = 
	if(isApple){
		try {
			const tokenData = await axios.post('https://api.mercadolibre.com/oauth/token', bodyApple, {
				headers: {
					Accept: 'application/json',
					'content-type': 'application/x-www-form-urlencoded',
				},
			})
			const token = tokenData.data.access_token
			return token
		} catch (error) {
			console.log(error.response.data, 'error en token apple')
			return token(true)
		}
	} else {
		try {
			// console.log(JSON.stringify(bodyMultimarcas))
			const tokenData = await axios.post('https://api.mercadolibre.com/oauth/token', bodyMultimarcas, {
				headers: {
					Accept: 'application/json',
					'content-type': 'application/x-www-form-urlencoded',
				},
			})
			const token = tokenData.data.access_token
			// console.log('token multimarcas')
			return token
		} catch (error) {
			console.log(error.response.data, 'error multimarcas token')
			return token(false)
		}
	}	
}

async function getTokens(){
	try {	
			const tokenApple = await token(true)
			const tokenMultimarcas = await token(false)	
			return [tokenApple, tokenMultimarcas]
	} catch (error) {
			console.log('error en getTokens')
	}
}
	
module.exports = {
	token,
	getTokens
}
