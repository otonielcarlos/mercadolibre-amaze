
// const {getProducts,getAllSkus, updateStock, updatePrevStock, getAllVariations, getAllNoVariations} = require('../../database/mercadolibre/stockDB')
// const trackingService = require('./trackingService') 
// const { getQueryToUpdateStockDB } = require('../../helpers/requests')
// const { joinItems } = require('../../helpers/requestForML')
// const { putStock } = require('../../helpers/postRequest')
const { skusChunks } = require('../../helpers/chunks')
const usePromise  = require( '../../helpers/errorHandling')
const {token} = require( '../../tokens/ml')
const {config} = require( 'dotenv')
config()
const {MERCADOLIBRE_URL_ACTIVE_ITEMS} = process.env
const {default: axios} = require( 'axios')

// async function updatePreviousStock(){
//   const [data, error] = await usePromise(updatePrevStock)
//   return data

// }

// async function getIngramPartNumbers(){
//   const [skus, error] = await usePromise(getAllSkus)
//   // console.log('error en getIngramPartNumbers', error)
  
//   return skus
// }

// function getIngramChunksOf(skus) {
//   return skusChunks(skus)
// }

// async function getupdateStockOfTheseSkus(ingramChunk){
//   const [query, error] = await usePromise(getQueryToUpdateStockDB, ingramChunk)
//   return query
// }

// async function saveUpdatedStockOfTheseSkus(query){
//   const [data, error] = await usePromise(updateStock, query)
//   return data
// }

// async function getVariationsProducts(){
//   try {
//     return await getAllVariations()
//   } catch (error) {
//     console.log(error, 'error en getVariationsProducts')
//   }
// }

// function variations(variationsProducts) {
//   try {
//     return joinItems(variationsProducts)
//   } catch (error) {
//     console.log(error, 'error en variations')
//   }
// }

// async function getItemsProducts(){
//   try {
//     return await getAllNoVariations()
//   } catch (error) {
//     console.log(error, 'error en getItemsProducts')
//   }
// }

// async function updateMercadolibre(items, variations){
//   try {
//     await putStock(variations)
//     await putStock(items)
//   } catch(error) {
//     console.log(error, 'error in updateMercadolibre')
//   }
// }


// async function getProductsUpdated(){
//   const [data, error] = await usePromise(getProducts)
//   console.log(error)
//   return data
// }

async function getPrices() {
  try {
    const accessToken = await token()
    const itemsData = await axios.get(`${MERCADOLIBRE_URL_ACTIVE_ITEMS}`, {headers: {'Authorization': `Bearer ${accessToken}`}})

    const {results, scroll_id, paging} = itemsData.data
    const {total} = paging
    if(paging > 100){
      const remainingItems = await axios.get(`${MERCADOLIBRE_URL_ACTIVE_ITEMS}?scroll_id=${scroll_id}`, {headers: {'Authorization': `Bearer ${accessToken}`}})
      const totalResults = [...results, ...remainingItems.data.results]
    }
    const totalResults = [...all]
    const items = totalResults.map(async item => {
      const ATTRIBUTE_SELLER_SKU = "SELLER_SKU"
      const urlVar = `https://api.mercadolibre.com/items/${item}/variations?include_attributes=all`
      const variations = await axios.get(urlVar, {headers: {'Authorization': `Bearer ${accessToken}`}})
      const filterVar = variations.data.map(variation => {
        const {id, attributes} = variation
        const sku = attributes.filter(attribute => attribute.id === ATTRIBUTE_SELLER_SKU)[0].value_name
        return {
          variation_id: id,
          sku: sku
        }
      })
      return {
        url: urlVar,
        item: item,
        variations: filterVar,
        sku: '',
        stock: 0,
      }
    })
    let query = 'INSERT INTO appleml VALUES '
   const totalPromises = await Promise.all(items)
   
console.log(totalPromises.length)
  } catch (error) {
    console.log(error, 'error en items')
  }
  
 
}

getPrices()
// module.exports = {
//   updatePreviousStock,
//   getIngramPartNumbers,
//   getIngramChunksOf,
//   getupdateStockOfTheseSkus,
//   saveUpdatedStockOfTheseSkus,
//   getVariationsProducts,
//   variations,
//   getItemsProducts,
//   updateMercadolibre,
//   getProductsUpdated,
//   getPrices
// }
