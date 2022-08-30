const {getStockMercadolibreApple} = require('../src/services/mercadolibre/stockService')
const {updateStockGoPro} = require('../src/services/gopro/stockService')
const {updateStockLinio} = require('../src/services/linio/stockService')
const usePromise = require('../src/helpers/errorHandling')

async function getStock() {
  const [gopro,errorGopro] = await usePromise(updateStockGoPro)
  const [mercadolibre,errorML] = await usePromise(getStockMercadolibreApple)
  await usePromise(updateStockLinio)
}

getStock()