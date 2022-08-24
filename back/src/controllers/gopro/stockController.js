const {updateStockGoPro} = require('../../services/gopro/stockService')
const usePromise = require('../../helpers/errorHandling')

async function getUpdatedProductsGoPro (req,res) {
  const [data, error] = await usePromise(updateStockGoPro)
  if(error) res.status(500).json({'error': 'error actualizando stock'})

  res.status(200).json(data)
}

module.exports = {
  getUpdatedProductsGoPro
}