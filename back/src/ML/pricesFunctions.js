const { getAllSkus, updateStock, updatePrevStock, getAllVariations, getAllNoVariations } = require('../ML/db')
const { skusChunks } = require('../helpers/chunks')
const { requestAPI } = require('../helpers/requests')
const { joinItems } = require('../helpers/requestForML')
const { putStock } = require('../helpers/postRequest')
// const { checkTickets } = require('../etiqueta/printTicket')

const getPrices = async () => {
  try{
    await updatePrevStock()
    const skus = await getAllSkus()
    const skusForAPI = skusChunks(skus)
    const responseFromIngram = await requestAPI(skusForAPI)
    await updateStock(responseFromIngram)
    const getVariations = await getAllVariations()
    const variations = joinItems(getVariations)
    const items = await getAllNoVariations()
    await putStock(variations)
    await putStock(items)
    // await checkTickets()

  } catch(err){
    console.error(err)
  }
    
}

getPrices()