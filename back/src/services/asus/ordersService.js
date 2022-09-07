const {default :axios} = require('axios')
const {getTodayAndYesterday} = require('../../helpers/getTodayAndYesterday')


async function getAsusOrders() {
  try {
    const [today, yesterday] = getTodayAndYesterday()
    

  } catch (error) {
    
  }
}

module.exports = {
  getAsusOrders
}