const stockService = require('../../services/mercadolibre/stockService')
const usePromise = require('../../helpers/errorHandling')
/*
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
*/
async function getAndUpdateStock(req, res){
  try {
    const [skus] = await usePromise(stockService.getIngramPartNumbers)
    const chunksOfSkus = stockService.getIngramChunksOf(skus)
    const [query, errQuery] = await usePromise(stockService.getupdateStockOfTheseSkus,chunksOfSkus)
    console.log(errQuery)
    const [message, error] = await usePromise(stockService.saveUpdatedStockOfTheseSkus, query)

    if(message) {
      res.set('Content-Type', 'application/json');
      res.send({"message": `${message}`})

    } else {
      res.set('Content-Type', 'application/json');
      res.send({"error": error})
    }
  } catch (error) {
    res.send({"error": `${error}`})
  }
}

async function getUpdatedProducts (req, res) {
  const [data, error] = await usePromise(stockService.getProductsUpdated)
  console.log(error)
  res.json(data)
}


module.exports = {
  getAndUpdateStock,
  getUpdatedProducts
}