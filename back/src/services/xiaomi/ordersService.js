const {default: axios} = require('axios')
const { IngramHeaders } = require('../../headers/ingramHeaders')
const {getEstado} = require('../../helpers/getEstado')
const { searchSku } = require('../../database/xiaomi/stockDB')
const { saveCompleteOrderInfo, updateIngramOrderNumber, saveOrderInDB } = require('../../database/xiaomi/ordersDB')
require('dotenv').config()
const {SHOPIFY_ACCESS_TOKEN_XIAOMI} = process.env
const config = {
  headers:{
    'X-Shopify-Access-Token' : `${SHOPIFY_ACCESS_TOKEN_XIAOMI}`
  }
}

async function getOrderFromShopify(body){
  // console.log(JSON.stringify(body))
  const {id, order_number, processed_at}  = body 
  const po = String(id)
  const {name,  
        address1, 
        address2, 
        phone,
        city,
        province,
        company,
        zip,
        } = body.shipping_address
  const total = body.current_subtotal_price
  const state = getEstado(province)
  const skusIngram = []

  const newAddress2 = address2 === null ? '' : address2 

  for(let products of body.line_items) {
    const {sku, quantity} = products
    const isSku = await searchSku(sku)

    skusIngram.push({sku: isSku[0].ingramPartNumber, quantity: quantity})
  }
  console.log(JSON.stringify(body.line_items))
  const lines = skusIngram.map((line, idx) => {
    const {sku, quantity} = line
    return  {
      "customerLineNumber": idx + 1,
      "ingramPartNumber": `${sku}`,
      "quantity": quantity
  }
  })

    const nameFull = name.substring(0,34)
    const customerOrder = `XIAOMI_${order_number}`
    const data = {
      "customerOrderNumber": customerOrder,
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
    await saveOrderInDB(id)
    await saveCompleteOrderInfo({...data, total_tienda: total, id: id, ...body, document_number: company, customerPo: customerOrder, phone, date: processed_at})
    console.log(JSON.stringify(data))
    return {data}
    }

  async function sendOrderToIngram(requestBody){
    try {
      const url = 'https://api.ingrammicro.com:443/resellers/v6/orders'
      const headers = await IngramHeaders()
      // console.log(JSON.stringify(headers))
      const responseIngram = await axios.post(url, requestBody, headers)
      const dataForDb = {
        ingramOrder: responseIngram.data.orders[0].ingramOrderNumber,
        customerPo: responseIngram.data.customerOrderNumber,

      }

      await updateIngramOrderNumber(dataForDb)
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
      const shopifyOrder = await axios.get(url, config)
      return shopifyOrder.data.order
    } catch (error) {
      console.log(error)
    }
  }

  async function deliveryXiaomiUpdate(orderBody){
    const url = `https://xiaomistorepe.myshopify.com/admin/api/2022-04/orders/${orderBody.order}/fulfillments.json`
    const data = {
      "fulfillment": {
          "location_id": 71718273259,
          "tracking_number": `${orderBody.delivery}`,
          "tracking_url": "https://amaze.com.pe/rastrea-tu-pedido/",
          "tracking_company": "Other",
          "notify_customer": true,
          "line_items": orderBody.lines
      }   
  }
  try {
    // console.log(data)
    const updateData = await axios.post(url, data, config)
    return updateData.data
  } catch (error) {
    console.log('no se puede actualizar', error.response.data)
  }
  
  }
module.exports = {
  getOrderFromShopify,
  sendOrderToIngram,
  getOrderDetailsShopify,
  deliveryXiaomiUpdate
}