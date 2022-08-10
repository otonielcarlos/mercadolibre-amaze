const axios = require('axios')
require('dotenv').config()
const {INGRAM_CLIENT_CUSTOMER, INGRAM_CORRELATION_ID} = process.env
const { ingramToken } = require('../tokens/ingramToken')
const {IngramHeaders} = require('../headers/ingramHeaders')
const url = 'https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=false&includeProductAttributes=true'

const getQueryToUpdateStockDB = async(skusForAPI) => {
  try {
    let responseArray = []
    let query = ''
    const config = await IngramHeaders()
  for(let i in skusForAPI){
    const data = {
      "showReserveInventoryDetails": true,
      "showAvailableDiscounts": false,
      "products": skusForAPI[i]
    }
    
    // @ts-ignore
    let responseFromAPI = await axios.post(url, data, config)
      responseFromAPI.data.forEach(response => {
        let responseObject = {sku: response.ingramPartNumber, stock: response.availability.totalAvailability}
        query += `UPDATE appleml set stock = '${responseObject.stock}' WHERE sku = '${responseObject.sku}';\n`
      })
    }
    // console.log(query)
  return query
  } catch (error) {
   console.log(error.response.data) 
  }
}

module.exports = {
  getQueryToUpdateStockDB
}
