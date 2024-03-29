
const { skusChunks } = require('../../helpers/chunks')
const usePromise  = require( '../../helpers/errorHandling')
const {token} = require( '../../tokens/ml')
const {config} = require( 'dotenv')
config()
const {MERCADOLIBRE_URL_ACTIVE_ITEMS, MERCADOLIBRE_ITEMS_URL} = process.env
const {default: axios} = require( 'axios')
const {getDataReadyToUpdate} = require('../../helpers/getDataReadyToUpdate')
const {getTokens} = require('../../database/mercadolibre/tokens')
 
async function getStockMercadolibreApple() {
  try {

    // GET ALL ACTIVE ITEMS WITH AND WITHOUT VARIATIONS
    const accessToken = await getTokens()
    console.log(accessToken)
    const itemsData = await axios.get(`${MERCADOLIBRE_URL_ACTIVE_ITEMS}`, {headers: {'Authorization': `Bearer ${accessToken.mercadolibreapple}`}})
    const ATTRIBUTE_SELLER_SKU = "SELLER_SKU"
    const {results, scroll_id, paging} = itemsData.data
    const {total} = paging
    let totalResults = []

    if(total > 100){
      const remainingItems = await axios.get(`${MERCADOLIBRE_URL_ACTIVE_ITEMS}&scroll_id=${scroll_id}`, {headers: {'Authorization': `Bearer ${accessToken.mercadolibreapple}`}})
       totalResults = [...results, ...remainingItems.data.results]
       console.log(totalResults.length)
      } else {
        totalResults = [...results]
        console.log(totalResults.length)
    }

      const items = totalResults.map(async item => {
      
      const urlVar = `https://api.mercadolibre.com/items/${item}/variations?include_attributes=all`
      const variations = await axios.get(urlVar, {headers: {'Authorization': `Bearer ${accessToken.mercadolibreapple}`}})
      if(variations.data.length === 0){
        return {
          itemid: item,
          variations: []
        }
      }
      const filteredVariations = variations.data.map(variation => {
        const { id, attributes } = variation
        const sku = attributes.filter(attribute => attribute.id === ATTRIBUTE_SELLER_SKU)[0].value_name
        return {
          itemid: item,
          variation_id: id,
          sku: sku
        }
      })
  
      return {
        item: item,
        variations: filteredVariations,
      }
    })

    let linesFull = []
   
    const totalDataOfProducts = await Promise.all(items)
    const itemProducts = totalDataOfProducts.filter(product => product.variations.length === 0)
    // console.log(itemProducts)

    const totalItems = itemProducts.map(async (item) => {
      const {itemid } = item
      const url = 'https://api.mercadolibre.com/items/' + itemid
      const itemData = await axios.get(url, {headers: {'Authorization': `Bearer ${accessToken.mercadolibreapple}`}})
      const {attributes} = itemData.data
      const sku = attributes.filter(attribute => attribute.id === ATTRIBUTE_SELLER_SKU)[0].value_name

      return {
        itemid,
        sku
      }
    })

    const itemFullData = await Promise.all(totalItems)

    const itemLines = itemFullData.map(item => {
      const { sku } = item 
        return sku
    })
    const itemDataStock = await getDataReadyToUpdate(itemLines)
    const itemDataToUpdate = itemDataStock?.map(item => {
      const {itemid} = itemFullData.filter(product => item.sku === product.sku)[0]
      const { stock } = item
      const data = {
        available_quantity: stock
      }

      return { itemid, data }
    })


    totalDataOfProducts.forEach(promise => {
      const variations = [... promise.variations]
      variations.forEach(variation => {
       linesFull =  [... linesFull,  `${variation.sku}`]
      })
    })


    let fullData = []
    totalDataOfProducts.forEach(promise => {
      fullData = [...fullData, ...promise.variations]
    })
    const dataStock = await getDataReadyToUpdate(linesFull)


    const dataSettle = fullData.map(item => {
      const { stock } = dataStock?.find(product => product.sku.includes(item.sku))
      delete item.sku
      return {
        ...item,
        stock: stock
      }
    })
    const groupedToPush = results.map(result => {
      const all = dataSettle.filter(product => product.itemid === result)
      .map(item => {
        return {
         id: item.variation_id,
         available_quantity: item.stock
        }
      
      })
      return {
        itemid: result,
        variations: [...all.flat()]
      }
    })

    let i = 1
    for(let itemGroup of groupedToPush){
      i++
      setTimeout(async () => {
        const { variations, itemid } = itemGroup
        const data = { variations }
        try {
          const isUpdated = await axios.put(`${MERCADOLIBRE_ITEMS_URL}/${itemid}`, data,  {headers: {'Authorization': `Bearer ${accessToken.mercadolibreapple}`}} )
        } catch (error) {
          console.log('no se puede actualizar variations', itemid, error.response.data)
        }
      }, i * 1000)
    }
   
    for(let itemGroup of itemDataToUpdate){
      i++
      setTimeout(async () => {
        const { itemid, data } = itemGroup
        try {
          const isUpdated = await axios.put(`${MERCADOLIBRE_ITEMS_URL}/${itemid}`, data,  {headers: {'Authorization': `Bearer ${accessToken.mercadolibreapple}`}} )
        } catch (error) {
          console.log('no se puede actualizar item ', itemid)
        }
      }, i * 1000)
    }
    console.log('actualizados', i)

  } catch (error) {
    console.log(error.response.data, 'error en items')
  }
}

module.exports = { getStockMercadolibreApple }

