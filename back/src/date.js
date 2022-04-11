const { default: axios } = require('axios');
const { token } = require('./tokens/ml');
const log = console.log;
const getDate = async resource => {
	try {
		let accessToken = await token();
		// @ts-ignore
		let resDate = await axios.get(`https://api.mercadolibre.com/${resource}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		let dateCreated = resDate.data.date_created;
		//log(dateCreated);
		let fullDate = dateCreated.slice(0, 10);
		//log(fullDate);
		return fullDate;
	} catch (error) {
		log('error getting date in date.js file');
	}
};
//getDate('orders/5081792652');
module.exports = {
	getDate,
};
