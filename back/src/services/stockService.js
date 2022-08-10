const { getAllSkus, updateStock, updatePrevStock, getAllVariations, getAllNoVariations } = require('../ML/db')
const { skusChunks } = require('../helpers/chunks')
const { requestAPI } = require('../helpers/requests')
const { joinItems } = require('../helpers/requestForML')
const { putStock } = require('../helpers/postRequest')
const { checkTracking } = require('../ML/checkTracking')

async function updatePreviousStock(){
  try {
    return await updatePrevStock()
  } catch (error) {
      console.log(error)
  }
}

async function getIngramPartNumbers(){
  try {
    return await getAllSkus()
  } catch (error) {
    console.log('error en getIngramPartNumbers', error)
  }
}

function getIngramChunksOf(skus) {
  return skusChunks(skus)
}

async function getupdateStockOfTheseSkus(ingramChunk){
  try {
    return await requestAPI(ingramChunk)
    
  } catch (error) {
    console.log('updateDBskus', error)
  }
}

async function saveUpdatedStockOfTheseSkus(query){
  try {
    return await updateStock(query)
  } catch (error) {
    
  }
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

module.exports = {
  updatePreviousStock,
  getIngramPartNumbers,
  getIngramChunksOf,
  getupdateStockOfTheseSkus,
  saveUpdatedStockOfTheseSkus,
  getVariationsProducts,
  variations,
  getItemsProducts,
  updateMercadolibre
}
