const { default: axios } = require('axios')
const log = console.log

const body = {
	"grant_type": "refresh_token",
	"client_id": "2796079999742920",
	"client_secret": "iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN",
	"refresh_token": "TG-62a770a0847ce100148f5017-766642543"
}

const body_1 = {
	grant_type: 'authorization_code',
	client_id: '2796079999742920',
	client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
	code: 'TG-61b770c171f899001bb1ee77-766642543',
	redirect_uri: 'https://appleamaze.herokuapp.com/',
}

const token = async () => {
	// @ts-ignore
	const tokenData = await axios.post('https://api.mercadolibre.com/oauth/token', body, {
			headers: {
				Accept: 'application/json',
				'content-type': 'application/x-www-form-urlencoded',
			},
		})
		// console.log(tokenData.data)
		const token = tokenData.data.access_token

		console.log(token);
		return token
}
	
module.exports = {
	token,
}
