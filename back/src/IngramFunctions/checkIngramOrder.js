const {default : axios} = require('axios')
const { IngramHeaders } = require('../headers/ingramHeaders')

async function isOrderInIngram(customerpo){
  try {
    const url = `https://api.ingrammicro.com:443/resellers/v6/orders/search?customerOrderNumber=MLAPPLE_${customerpo}`
    const config = await IngramHeaders()
    const checkOrder = await axios(url, config)
    const {status} = checkOrder

    if(status === 200){
      return true
    }
    return false
  } catch (error) {
    console.log(error.response.data)
  }
}

module.exports = {isOrderInIngram}