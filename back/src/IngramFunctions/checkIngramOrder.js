const {default : axios} = require('axios')
const { IngramHeaders } = require('../headers/ingramHeaders')

async function isOrderInIngram(customerpo){
  try {
    const url = `https://api.ingrammicro.com:443/resellers/v6/orders/search?customerOrderNumber=MLAPPLE_${customerpo}`
    const config = await IngramHeaders()
    const checkOrder = await axios(url, config)
    const {status} = checkOrder

    if(status === 200){
      const data = {
        isFound: true,
        ingramOrderNumber: checkOrder.data.orders[0].ingramOrderNumber
      }
      return data
    }
    const data = {
      isFound: false,
    }
    return data
  } catch (error) {
    console.log(error.response.data)
  }
}

module.exports = {isOrderInIngram}