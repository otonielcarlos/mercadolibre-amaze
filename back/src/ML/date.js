const { default: axios } = require('axios')
const { token } = require('../tokens/ml')
const log = console.log


async function getDateOrder(resource){
	try
	{
		let accessToken = await token()
		// @ts-ignore
		let resDate = await axios.get(`https://api.mercadolibre.com/orders/${ resource }`, {
			headers: { Authorization: `Bearer ${ accessToken }` },
		})

		let dateCreated = resDate.data.date_created
		//log(dateCreated)
		let fullDate = dateCreated.slice(0, 10)
		//log(fullDate)
		return fullDate
	} catch (error)	{
		log('error getting date in date.js file')
	}
}

function getToday(){
	const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5)
  let today = saveDate.toISOString().split('T')[0]

	return {today}
}





//getDate('orders/5081792652')
module.exports = {
	getDateOrder,
	getToday
}
