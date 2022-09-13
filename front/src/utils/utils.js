function getTodayAndYesterday(){
  let today = new Date()
  today.setHours(today.getHours() - 5)
  today  = today.toISOString().split('T')[0]
  const date = new Date()
  date.setHours(date.getHours() - 5)
  let yesterday = new Date(date.getTime())
  yesterday.setDate(date.getDate() - 1)
  yesterday  = yesterday.toISOString().split('T')[0]
  
  return {today, yesterday}

}

export {getTodayAndYesterday}