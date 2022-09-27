const {default: axios} = require('axios')
require('dotenv').config()
const {INGRAM_CLIENT_CUSTOMER, INGRAM_CORRELATION_ID} = process.env
const { ingramToken } = require('../tokens/ingramToken')
const {IngramHeaders} = require('../headers/ingramHeaders')
const url = 'https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=false&includeProductAttributes=true'
const {skusChunks} = require('../helpers/chunks')

const getDataReadyToUpdate = async(skusForAPI) => {
  try {
    const chunksOfsku = skusChunks(skusForAPI)
    const config = await IngramHeaders()
    // console.log(config)
    let arrayToReturn = []
    for(let chunk of chunksOfsku){
      const data = {
        "showReserveInventoryDetails": true,
        "showAvailableDiscounts": false,
        "products": chunk
      }

      let responseFromAPI = await axios.post(url, data, config)

      const arrayUpdated = responseFromAPI.data.map(response => {
        let stock = 0

        if(response.availability.hasOwnProperty('availabilityByWarehouse')) {
          stock =  response.availability.availabilityByWarehouse
          .find(warehouse => warehouse.warehouseId === "PE10")
          .quantityAvailable
        }
        
        return {sku: response.ingramPartNumber, stock: stock}
      })
      arrayToReturn = [...arrayToReturn, ...arrayUpdated]

      }
      // console.log(arrayToReturn)
      // console.table(arrayToReturn.filter(item => item.sku !== '').flat())
    return arrayToReturn
  } catch (error) {
   console.log('error en prices v6 ingram') 
  }
}

module.exports = {
  getDataReadyToUpdate
}
