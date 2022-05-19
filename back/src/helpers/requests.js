const axios = require('axios')
const { ingramToken } = require('../tokens/ingramToken')
const url = 'https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=false&includeProductAttributes=true'

const requestAPI = async(skusForAPI) => {
  try {
    let responseArray = []
    let query = ''
  const token = await ingramToken()
  const config = {
    headers: {
      "IM-CustomerNumber": "325831",
      "IM-CorrelationID": "fbac82ba-cf0a-4bcf-fc03-0c508457f219-bw0a102j",
      "IM-CountryCode": "PE",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }
  console.log(skusForAPI)
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
    //console.log(query)
  return query
  } catch (error) {
   console.log(error.response.data.errors[0].fields) 
  }
}

module.exports = {
  requestAPI
}
