
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
const all = [
  "MPE445898844",
  "MPE445898834",
  "MPE445898831",
  "MPE445898830",
  "MPE445898829",
  "MPE445898828",
  "MPE445898823",
  "MPE445898822",
  "MPE445898821",
  "MPE445898818",
  "MPE445898816",
  "MPE445898814",
  "MPE445898812",
  "MPE445898811",
  "MPE445898809",
  "MPE445898802",
  "MPE445898801",
  "MPE445898798",
  "MPE445933125",
  "MPE445933121",
  "MPE445933120",
  "MPE445933118",
  "MPE445933117",
  "MPE445933116",
  "MPE445933113",
  "MPE445933112",
  "MPE445933111",
  "MPE445933110",
  "MPE445972959",
  "MPE445992192",
  "MPE445990670",
  "MPE445990529",
  "MPE445990495",
  "MPE445990448",
  "MPE445990348",
  "MPE445990310",
  "MPE445990279",
  "MPE445990218",
  "MPE445990192",
  "MPE445990151",
  "MPE445990123",
  "MPE445979845",
  "MPE446002639",
  "MPE446002587",
  "MPE446002572",
  "MPE446589106",
  "MPE446588634",
  "MPE446588483",
  "MPE446588472",
  "MPE446588458",
  "MPE446588454",
  "MPE446588422",
  "MPE446588366",
  "MPE55002795",
  "MPE55002790",
  "MPE446600326",
  "MPE446600246",
  "MPE446600170",
  "MPE446600094",
  "MPE446599423",
  "MPE446599268",
  "MPE446605201",
  "MPE446605121",
  "MPE446605089",
  "MPE446604968",
  "MPE446604955",
  "MPE446604858",
  "MPE446654299",
  "MPE446654020",
  "MPE446647631",
  "MPE446647476",
  "MPE446728735",
  "MPE446769537",
  "MPE446769491",
  "MPE446769372",
  "MPE446769304",
  "MPE446769267",
  "MPE446769207",
  "MPE446769168",
  "MPE446769067",
  "MPE446769010",
  "MPE446768791",
  "MPE447153623",
  "MPE447153178",
  "MPE447191668",
  "MPE447189122",
  "MPE447362338",
  "MPE447357677",
  "MPE447567465",
  "MPE447737421",
  "MPE447737398",
  "MPE447815416",
  "MPE447814935",
  "MPE447856134",
  "MPE447861675",
  "MPE447861414",
  "MPE447861239",
  "MPE447867369",
  "MPE447866769",
  "MPE447866731",
  "MPE447939275",
  "MPE447938664",
  "MPE447937816",
  "MPE447937599",
  "MPE447969825",
  "MPE447969794",
  "MPE447969772",
  "MPE447969736",
  "MPE447969447",
  "MPE448040585",
  "MPE448036399",
  "MPE600030209",
  "MPE600030197",
  "MPE448106552",
  "MPE448106473",
  "MPE600376171",
  "MPE600376157",
  "MPE602729065",
  "MPE602728640",
  "MPE602715970",
  "MPE602715633",
  "MPE602715589",
  "MPE602703605",
  "MPE602691645",
  "MPE602678261",
  "MPE602671947",
  "MPE602670861",
  "MPE602630595",
  "MPE602813153",
  "MPE602794872",
  "MPE602781937",
  "MPE602742597",
  "MPE602879571",
  "MPE602868120",
  "MPE602860149",
  "MPE603079698",
  "MPE603066707",
  "MPE603033843",
  "MPE603032162",
  "MPE603025379",
  "MPE603024763",
  "MPE603013881",
  "MPE603011394",
  "MPE603006974",
  "MPE602993093",
  "MPE602988376",
  "MPE602987742",
  "MPE602986686",
  "MPE602986557",
  "MPE602986387",
  "MPE602985895",
  "MPE602981338",
  "MPE602979312",
  "MPE602972901",
  "MPE605848848",
  "MPE611679045",
  "MPE612453586",
  "MPE612466835",
  "MPE612652603",
  "MPE612653123",
  "MPE612823090",
  "MPE612810390",
  "MPE612758533",
  "MPE612634421",
  "MPE614396060",
  "MPE614598934"
]
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
    totalPromises.forEach(promise => {
      promise.variations.forEach(variationArray => {
        query += `('${variationArray.sku}', '${promise.item}', '0' , '0', '${variationArray.variation_id}'),\n`
      })
    })
console.log(all.length)
  } catch (error) {
    console.log(error, 'error en items')
  }
  
 
}

