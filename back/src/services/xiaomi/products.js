const {default: axios} = require('axios')
require('dotenv')
const {SHOPIFY_ACCESS_TOKEN_XIAOMI} = process.env


async function getProducts() {
  try {
    const urlDesc = 'https://s5.aconvert.com/convert/p3r68-cdx67/jfudi-xtsl7.json'
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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'
      }
    }
    
    const productos = await axios.get(urlDesc)
    for(let product of productos.data) {
      const url = `https://xiaomistorepe.myshopify.com/admin/api/2022-10/products/${product.product_id}.json`
      const body = {
        "product": {
          "id": Number(product.product_id),
          "body_html": `${product.body_html}`
        }
      }
      // console.log(body)
      const isUpdated = await axios.put(url, body, config)
      console.log(isUpdated.data.product.id)
    }


  } catch (error) {
    console.log(error.repsonse)
  }
}
getProducts()