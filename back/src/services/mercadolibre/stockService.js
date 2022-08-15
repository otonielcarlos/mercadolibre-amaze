
const { skusChunks } = require('../../helpers/chunks')
const usePromise  = require( '../../helpers/errorHandling')
const {token} = require( '../../tokens/ml')
const {config} = require( 'dotenv')
config()
const {MERCADOLIBRE_URL_ACTIVE_ITEMS, MERCADOLIBRE_ITEMS_URL} = process.env
const {default: axios} = require( 'axios')
const {getDataReadyToUpdate} = require('../../helpers/getDataReadyToUpdate')


async function getPricesVariations() {
  try {

    // GET ALL ACTIVE ITEMS WITH AND WITHOUT VARIATIONS
    const accessToken = await token()
    const itemsData = await axios.get(`${MERCADOLIBRE_URL_ACTIVE_ITEMS}`, {headers: {'Authorization': `Bearer ${accessToken}`}})

    const {results, scroll_id, paging} = itemsData.data
    const {total} = paging
    let totalResults = []
    if(paging > 100){
      const remainingItems = await axios.get(`${MERCADOLIBRE_URL_ACTIVE_ITEMS}?scroll_id=${scroll_id}`, {headers: {'Authorization': `Bearer ${accessToken}`}})
       totalResults = [...results, ...remainingItems.data.results]
    } else {
     totalResults = [...results]
    }
    let itemsArray = []
      const items = totalResults.map(async item => {
      const ATTRIBUTE_SELLER_SKU = "SELLER_SKU"
      const urlVar = `https://api.mercadolibre.com/items/${item}/variations?include_attributes=all`
      const variations = await axios.get(urlVar, {headers: {'Authorization': `Bearer ${accessToken}`}})
      if(variations.data.length === 0){
        return {
          itemid: item,
          variations: []
        }
      }
      const filterVar = variations.data.map(variation => {
        const {id, attributes} = variation
        const sku = attributes.filter(attribute => attribute.id === ATTRIBUTE_SELLER_SKU)[0].value_name
        return {
          itemid: item,
          variation_id: id,
          sku: sku
        }
      })
      return {
        item: item,
        variations: filterVar,
      }
    })

    let linesFull = []
   
    const totalDataOfProducts = await Promise.all(items)
    const itemProducts = totalDataOfProducts.filter(product => product.variations.length === 0)
    console.log(itemProducts)
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
    console.log(fullData)
    const lines = skusChunks(linesFull)

    const [dataStock, error] = await usePromise(getDataReadyToUpdate, lines)
    if(error) throw error

    const dataSettle = fullData.map(item => {
      const { stock } = dataStock.find(product => product.sku.includes(item.sku))
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
        variations: [... all.flat()]
      }
    })

    for(let itemGroup of groupedToPush){
      const { variations, itemid } = itemGroup
      const data = { variations }
  //  const isUpdated = await axios.put(`${MERCADOLIBRE_ITEMS_URL}/${itemid}`, data,  {headers: {'Authorization': `Bearer ${accessToken}`}} )
  //  console.log(isUpdated.data.id)
    }
  } catch (error) {
    console.log(error, 'error en items')
  }
}

getPricesVariations()

