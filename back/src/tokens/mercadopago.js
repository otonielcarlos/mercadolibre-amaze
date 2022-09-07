
const {default: axios} = require('axios')
const bodyGoPro = {
  "client_secret": "nkG1rtOX2dSirNNLGElnLkqqGg5UOOYM",
  "client_id": "8641619197625627",
  "grant_type": "refresh_token",
  "refresh_token": "TG-6318d554028cf20001e99d66-1087789496"
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