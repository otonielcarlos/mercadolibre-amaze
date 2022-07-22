const { default: axios } = require('axios')
const { token } = require('../tokens/ml')
const log = console.log


async function getDateOrder(resource, account){
try {
	

	try {
		let accessToken = await token(account)
		// @ts-ignore
		let resDate = await axios.get(`https://api.mercadolibre.com/orders/${ resource }`, {
			headers: { Authorization: `Bearer ${ accessToken }` },
		})

		let dateCreated = resDate.data.date_created
		log(dateCreated)
		let fullDate = dateCreated.slice(0, 10)
		//log(fullDate)
		return fullDate
	} catch (error)	{
		if(error){
			let cuenta = account === 'APPLE' ? 'APPLE' : 'MULTIMARCAS'
			let accessToken = await token(cuenta)
			// @ts-ignore
		let resDate = await axios.get(`https://api.mercadolibre.com/orders/${ resource }`, {
			headers: { Authorization: `Bearer ${ accessToken }` },
		})

		let dateCreated = resDate.data.date_created
		log(dateCreated)
		let fullDate = dateCreated.slice(0, 10)
		//log(fullDate)
		return fullDate
		}
	}
} catch (error) {
	console.log(error.response.data, 'error in date.js')
}
}

function getToday(){
	const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5)
  let today = saveDate.toISOString().split('T')[0]

	return {today}
}


function getYesterday(){
	const date = new Date()
	date.setHours(date.getHours() - 5)
	let previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

	const yesterday = previous.toISOString().split('T')[0]
  // console.log(yesterday)
  return {yesterday};
}

function getTodayAndYesterday(){
	const {today} = getToday()
	const {yesterday} = getYesterday()

	return {today, yesterday}
}


module.exports = {
	getDateOrder,
	getToday,
	getYesterday,
	getTodayAndYesterday
}



