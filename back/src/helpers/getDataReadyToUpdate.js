const {default: axios} = require('axios')
require('dotenv').config()
const {INGRAM_CLIENT_CUSTOMER, INGRAM_CORRELATION_ID} = process.env
const { ingramToken } = require('../tokens/ingramToken')
const {IngramHeaders} = require('../headers/ingramHeaders')
const url = 'https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=false&includeProductAttributes=true'

const getDataReadyToUpdate = async(skusForAPI) => {
  try {

    const config = await IngramHeaders()
    let arrayToReturn = []
    for(let chunk of skusForAPI){
      const data = {
        "showReserveInventoryDetails": true,
        "showAvailableDiscounts": false,
        "products": chunk
      }

      let responseFromAPI = await axios.post(url, data, config)
      const arrayUpdated = responseFromAPI.data.map(response => {
        return {sku: response.ingramPartNumber, stock: response.availability.totalAvailability}
      })
      arrayToReturn = [...arrayToReturn, ...arrayUpdated]

      }

    return arrayToReturn
  } catch (error) {
   console.log(error.response.data, 'error en prices v6 ingram') 
  }
}

module.exports = {
  getDataReadyToUpdate
}
