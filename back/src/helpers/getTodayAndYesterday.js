function getTodayAndYesterday(){
const today = new Date()
  today.setHours(today.getHours() - 5)
  let hoy = today.toISOString().split('T')[0]
  const date = new Date()
  date.setHours(date.getHours() - 5)
  let yesterday = new Date(date.getTime())
  yesterday.setDate(date.getDate() - 1)
  const  ayer = yesterday.toISOString().split('T')[0]
  
  return [hoy, ayer]

}

function getTodayAndTime() {
  const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 6)
  let day = saveDate.toISOString().split('T')[0]
  let time = saveDate.toISOString().split('T')[1].split('.')[0]
  // let created_at =  `${day} ${time}`

  return [day, time]
}

module.exports = {
  getTodayAndYesterday,
  getTodayAndTime
}