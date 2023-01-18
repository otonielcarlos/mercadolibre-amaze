const {default: axios} = require('axios')
const { IngramHeaders } = require('../../headers/ingramHeaders')
const {getEstado} = require('../../helpers/getEstado')
const { searchSku } = require('../../database/xiaomi/stockDB')
require('dotenv').config()
const {SHOPIFY_ACCESS_TOKEN_XIAOMI} = process.env


async function getOrderFromShopify(body){
  const {id, order_number} = body 
  const po = String(id)
  const {name,  
        address1, 
        address2, 
        phone,
        city,
        province,
        zip,
        } = body.shipping_address

        console.log(JSON.stringify(body.shipping_address))
  const state = getEstado(province)
  const skusIngram = []

  const newAddress2 = address2 === null ? '' : address2 

  for(let products of body.line_items) {
    const {sku, quantity, price} = products
    const isSku = await searchSku(sku)
    skusIngram.push({sku: isSku, quantity: quantity})
  }
  
  const lines = skusIngram.map((line, idx) => {
    const {sku, quantity} = line
    return  {
      "customerLineNumber": idx + 1,
      "ingramPartNumber": `${sku}`,
      "quantity": quantity
  }
  })

    const nameFull = name.substring(0,34)
    const data = {
      "customerOrderNumber": `XIAOMI_${order_number}`,
      "notes": "",
      "shipToInfo": {
        "contact": nameFull,
        "companyName": nameFull,
        "name1": nameFull,
        "addressLine1": `${address1.substring(0,34)}`,
        "addressLine2": `${newAddress2.substring(0,34)}`,
        "addressLine3": `${phone}`,
        "city": `${city}`,
        "state": `${state}`,
        "countryCode": "PE"
    },
      "lines": lines,
      "additionalAttributes": [
        {
            "attributeName": "allowDuplicateCustomerOrderNumber",
            "attributeValue": "false"
        },
        {
            "attributeName": "allowOrderOnCustomerHold",
            "attributeValue": "true"
        }
    ]
  }
    
    // console.log(data)
    console.log(JSON.stringify(data))
    return {data}
    }

  async function sendOrderToIngram(requestBody){
    try {
      const url = 'https://api.ingrammicro.com:443/resellers/v6/orders'
      const headers = await IngramHeaders()
      // console.log(JSON.stringify(headers))
      const responseIngram = await axios.post(url, requestBody, headers)
      const data = {
        customerpo: responseIngram.data.customerOrderNumber,
        ingramOrderNumber: responseIngram.data.orders[0].ingramOrderNumber,
        vendorPartNumber: responseIngram.data.orders[0].lines[0].vendorPartNumber,
        name: responseIngram.data.shipToInfo.contact
    }
      return {data}
    } catch (error) {
      console.log(error.response)
    }
  }


  async function getOrderDetailsShopify(orderid){
    try {
      const url = `https://xiaomistorepe.myshopify.com/admin/api/2022-04/orders/${orderid}.json`
      const config = {
        headers:{
          'X-Shopify-Access-Token' : `${SHOPIFY_ACCESS_TOKEN_XIAOMI}`
        }
      }
      const shopifyOrder = await axios.get(url, config)
      return shopifyOrder.data.order
    } catch (error) {
      console.log(error)
    }
  }

module.exports = {
  getOrderFromShopify,
  sendOrderToIngram,
  getOrderDetailsShopify
}