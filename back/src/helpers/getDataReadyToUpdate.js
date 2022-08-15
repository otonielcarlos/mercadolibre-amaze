const {default: axios} = require('axios')
require('dotenv').config()
const {INGRAM_CLIENT_CUSTOMER, INGRAM_CORRELATION_ID} = process.env
const { ingramToken } = require('../tokens/ingramToken')
const {IngramHeaders} = require('../headers/ingramHeaders')
const url = 'https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=false&includeProductAttributes=true'

const getDataReadyToUpdate = async(skusForAPI) => {
  try {
    // console.log(skusForAPI)
    const config = await IngramHeaders()
    let arrayToReturn = []
  for(let chunk of skusForAPI){
    const data = {
      "showReserveInventoryDetails": true,
      "showAvailableDiscounts": false,
      "products": chunk
    }
    // console.log(data)
    let responseFromAPI = await axios.post(url, data, config)
     responseFromAPI.data.forEach(response => {
      arrayToReturn =  [... arrayToReturn, {sku: response.ingramPartNumber, stock: response.availability.totalAvailability}]
      })

    }

    return arrayToReturn
  } catch (error) {
   console.log(error.response.data.errors[0].fields, 'error en prices v6 ingram') 
  }
}

module.exports = {
  getDataReadyToUpdate
}
