const {default: axios} = require('axios')
const {token} = require('../tokens/ml')

async function checkOrderStatusPaid(id){
  try {
    const url = `https://api.mercadolibre.com/orders/${id}`
    const access_token = await token()
    const config ={ headers: {'Authorization': `Bearer ${access_token}`}}
    const isPaid = await axios.get(url, config)
    
    if(isPaid.data.status === "paid"){
      return true
    }

    return false

  } catch (error) {
    console.log(error.response.data)
  }
}

module.exports = {
  checkOrderStatusPaid
}