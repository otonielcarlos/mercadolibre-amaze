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
  getToday,
  getYesterday,
  getTodayAndYesterday
}