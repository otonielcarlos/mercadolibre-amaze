const { getAllSkus, updateStock, updatePrevStock, getAllVariations, getAllNoVariations } = require('../ML/db')
const { skusChunks } = require('../helpers/chunks')
const { getQueryToUpdateStockDB } = require('../helpers/requests')
const { joinItems } = require('../helpers/requestForML')
const { putStock } = require('../helpers/postRequest')
const { checkTracking } = require('./checkTracking')

async function getPrices() {
    try {
    await updatePrevStock()
    const skus = await getAllSkus()
    const skusForAPI = skusChunks(skus)
    const responseFromIngram = await getQueryToUpdateStockDB(skusForAPI)
    await updateStock(responseFromIngram)
    const getVariations = await getAllVariations()
    const variations = joinItems(getVariations)
    const items = await getAllNoVariations()
    await putStock(variations)
    await putStock(items)
    } catch (error) {
      console.log(error, 'error en items')
    }
    
    try {
      await checkTracking('APPLE')
      await checkTracking('MULTIMARCAS')
    } catch (error) {
      console.log(error, 'error in checking tracking')
    }
}
 
getPrices()