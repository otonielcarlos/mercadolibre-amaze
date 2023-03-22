const {default:axios} = require('axios')
const {getSkus, updateStock, updatePrevStock, getStockToUpdate, getPrices} = require('../../database/xiaomi/stockDB')
require('dotenv').config()
const {SHOPIFY_ACCESS_TOKEN_XIAOMI} = process.env
const arrayChunk = require('array-chunk');
const { IngramHeaders } = require('../../headers/ingramHeaders');
const {products} = require('./productsComplete')

async function updateDBStock(){
  try {
    await updatePrevStock()
    const skus = await getSkus()
    // console.log(skus)
    const products = arrayChunk(skus, 50)
    let isStockUpdated = []
    const config = await IngramHeaders()
    
    for(let product of products ){
      let data = {
        "showReserveInventoryDetails": false,
        "showAvailableDiscounts": false,
        "products": product
      }
      const url = 'https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=false&includeProductAttributes=false'
      const stockResponse = await axios.post(url, data, config)

      stockResponse.data.forEach(product => {
        // console.log(product)
        let isAvailable = product.availability.available 
        if(isAvailable){
          const stock = product.availability.availabilityByWarehouse
          .find(item => item.warehouseId === "PE10")
          .quantityAvailable
          console.log(product.ingramPartNumber, stock)
          // console.log(stock)
          isStockUpdated.push({ 
              ingramPartNumber: product.ingramPartNumber, 
              stock: Number(stock)
            })

        } else{
          isStockUpdated.push({ 
            ingramPartNumber: product.ingramPartNumber, 
            stock: 0
          })}
      })
    }

  let query = ''
  isStockUpdated.forEach(item => {
    query+= `UPDATE shopifyxiaomi SET stock = '${item.stock}' WHERE ingramPartNumber = '${item.ingramPartNumber}'; \n`
  })
  // console.log(query)
  await updateStock(query)
  
    
} catch (error) {
    console.log(error)
  }
}

async function updateShopifyStock() {
  const inventoryIds = await getStockToUpdate();
  let updateUrl = 'https://xiaomistorepe.myshopify.com/admin/api/2022-04/inventory_levels/set.json';

  let delay = 500; // 500 ms de espera entre llamadas para no exceder 2 llamadas por segundo

  async function processItem(item) {
    try {
      const isPublished = Number(item.stock) > 0;
      let dataInventoryId = {
        "location_id": 71718273259,
        "inventory_item_id": item.inventory_id,
        "available": Number(item.stock),
      };


      await axios.post(updateUrl, dataInventoryId, {headers: {'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN_XIAOMI}});
      // console.log(isUpdated.data.inventory_level.inventory_item_id, isUpdated.data.inventory_level.available);
    } catch (error) {
      console.log('not updating', item, error.response.data);
    }
  }

  for (let i = 0; i < inventoryIds.length; i++) {
    setTimeout(async () => {
      await processItem(inventoryIds[i]);
    }, i * delay);
  }
}







async function putPrices() {
  try {
    const productPrices = await getPrices()
    const config = {
      headers: {
        'X-Shopify-Access-Token': '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',
        'Content-Type': 'application/json'
      }
    }
    // console.log(productPrices)
    for(let product of productPrices) {
     const data = {
        "product": {
            "id": product.product_id,
            "variants": [
                {
                    "id": product.variant_id,
                    "price": `${product.discount}`,
                    "compare_at_price": `${product.price}`
                }  
            ]
        }
    }
    console.log(JSON.stringify(data))
    const url = `https://xiaomistorepe.myshopify.com/admin/api/2022-04/products/${product.product_id}.json`
    const res = await axios.put(url, data, config)
    console.log(res.data.product.id)
    }

  } catch (error) {
    console.log(error.response.data)
  }
}


//Function to obtain the list of Shopify products from products array with their product_id, variant_id, inventory_id, sku, price, discount.
async function getShopifyProducts(){ 
  try {
    const config = {
      headers: {   
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN_XIAOMI,
        'Content-Type': 'application/json'
      }
    }
    const url = 'https://xiaomistorepe.myshopify.com/admin/api/2022-04/products.json?limit=250'
    const response = await axios.get(url, config)
    const products = response.data.products
    let shopifyProducts = []
    console.log(products.length)
    for(let product of products){
      const product_id = product.id
      const variant_id = product.variants[0].id

      const inventory_id = product.variants[0].inventory_item_id
      const sku = product.variants[0].sku
      const price = product.variants[0].price
      const discount = product.variants[0].compare_at_price
      shopifyProducts.push({product_id, variant_id, inventory_id, sku, price, discount})
    }
   console.table(shopifyProducts)
    return shopifyProducts
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateDBStock, 
  updateShopifyStock
}


