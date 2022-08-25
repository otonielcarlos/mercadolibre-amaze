const {default: WooCommerceRestApi} = require('@woocommerce/woocommerce-rest-api')
const { config } = require('dotenv')
config()
const {CK , CS, GOPRO_URL} = process.env
const {getDataReadyToUpdate} = require('../../helpers/getDataReadyToUpdate')
const {skusChunks} = require('../../helpers/chunks')

const api = new WooCommerceRestApi({
  url: `${GOPRO_URL}`,
  consumerKey: `${CK}`,
  consumerSecret: `${CS}`,
  version: "wc/v3"
})

async function updateStockGoPro(){
  try {
    const products = await api.get('products', {'per_page': '100'})
    
    const arraySkus = products.data.map(product => {
      const { sku } = product
      return sku
    }).filter(item => item !== '')


    let skusFormatted = skusChunks(arraySkus)
    const updatedSkuStock = await getDataReadyToUpdate(skusFormatted)
    
    const update = updatedSkuStock?.map(product => {
      const id = products.data.find(item => item.sku === product.sku).id
      const stockStatus = (product.stock > 0) ? 'instock' : 'outofstock'  
      let stock = (product.stock > 20) ? 20 : product.stock
      
      return {
        id: id,
        stock_quantity: stock,
        stock_status: stockStatus
      }
  })
    const data = { update }

    const isUpdated = await api.post('products/batch', data)
    const stockUpdated = isUpdated.data.update.map(product => {
      const {id, sku, stock_quantity, stock_status, date_modified} = product

      return {id, sku, stock_quantity, stock_status, date_modified} 
    })
    isUpdated.data.update.map( product => console.log(product.sku, product.stock_quantity))
    console.log('gopro stock updated')
    return stockUpdated

    } catch (error) {
      console.log(error, 'error en stock gopro services')
    }
}

module.exports = {
  updateStockGoPro
}