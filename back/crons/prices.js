const {getStockMercadolibreApple} = require('../src/services/mercadolibre/stockService')
const {updateStockGoPro} = require('../src/services/gopro/stockService')
const {updateStockLinio} = require('../src/services/linio/stockService')
const {updateAllAsusOrdersInfo} = require('../src/services/asus/ordersService')
const usePromise = require('../src/helpers/errorHandling')
const {createAndUpdateTokens} = require('../src/helpers/tokenHelpers')
const { updateGoProOrdersInfo } = require('../src/services/gopro/ordersService')

async function getStock() {
  const [gopro,errorGopro] = await usePromise(updateStockGoPro)
  const [mercadolibre,errorML] = await usePromise(getStockMercadolibreApple)
  await usePromise(updateStockLinio)
  await usePromise(updateAllAsusOrdersInfo)
  await usePromise(createAndUpdateTokens)
  await updateGoProOrdersInfo()
}

getStock()