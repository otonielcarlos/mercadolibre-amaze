
const {getProducts,getAllSkus, updateStock, updatePrevStock, getAllVariations, getAllNoVariations} = require('../database/stockDB')
const trackingService = require('../services/trackingService') 
const { skusChunks } = require('../helpers/chunks')
const { getQueryToUpdateStockDB } = require('../helpers/requests')
const { joinItems } = require('../helpers/requestForML')
const { putStock } = require('../helpers/postRequest')
const usePromise = require('../helpers/errorHandling')

async function updatePreviousStock(){
  const [data, error] = await usePromise(updatePrevStock)
  return data

}

async function getIngramPartNumbers(){
  const [skus, error] = await usePromise(getAllSkus)
  // console.log('error en getIngramPartNumbers', error)
  
  return skus
}

function getIngramChunksOf(skus) {
  return skusChunks(skus)
}

async function getupdateStockOfTheseSkus(ingramChunk){
  const [query, error] = await usePromise(getQueryToUpdateStockDB, ingramChunk)
  return query
}

async function saveUpdatedStockOfTheseSkus(query){
  const [data, error] = await usePromise(updateStock, query)
  return data
}

async function getVariationsProducts(){
  try {
    return await getAllVariations()
  } catch (error) {
    console.log(error, 'error en getVariationsProducts')
  }
}

function variations(variationsProducts) {
  try {
    return joinItems(variationsProducts)
  } catch (error) {
    console.log(error, 'error en variations')
  }
}

async function getItemsProducts(){
  try {
    return await getAllNoVariations()
  } catch (error) {
    console.log(error, 'error en getItemsProducts')
  }
}

async function updateMercadolibre(items, variations){
  try {
    await putStock(variations)
    await putStock(items)
  } catch(error) {
    console.log(error, 'error in updateMercadolibre')
  }
}


async function getProductsUpdated(){
  const [data, error] = await usePromise(getProducts)
  console.log(error)
  return data
}

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
  await updateMercadolibre(items, variations)
  } catch (error) {
    console.log(error, 'error en items')
  }
  
  try {
    await trackingService.checkTracking('APPLE')
    await trackingService.checkTracking('MULTIMARCAS')
  } catch (error) {
    console.log(error, 'error in checking tracking')
  }
}

module.exports = {
  updatePreviousStock,
  getIngramPartNumbers,
  getIngramChunksOf,
  getupdateStockOfTheseSkus,
  saveUpdatedStockOfTheseSkus,
  getVariationsProducts,
  variations,
  getItemsProducts,
  updateMercadolibre,
  getProductsUpdated,
  getPrices
}
