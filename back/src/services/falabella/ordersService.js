const {default:axios} = require('axios')
const { getEstado  } = require('../../helpers/getEstado')
const { IngramHeaders } = require('../../headers/ingramHeaders')
const { getSignature } = require('./orderUtils')
const {INGRAM_ORDER_URL} = process.env

function prepareDataForIngram(order, items){
  const {OrderNumber, Price} = order.SuccessResponse.Body.Orders.Order
  const {FirstName, LastName, Phone, Phone2, Address1, Address2, Address3, Address4, Ward, Region} = order.SuccessResponse.Body.Orders.Order.AddressShipping
  console.log(order.SuccessResponse.Body.Orders.Order.AddressShipping)
    let lines = []
    let i = 1
    let products = items.SuccessResponse.Body.OrderItems.OrderItem
    if(Array.isArray(products)){
        products.forEach(product => {
            lines.push({
                "customerLineNumber": `${i}`,
                "ingramPartNumber": `${product.Sku}`,
                "quantity": 1
            })
            i++
        })
    } else {
        lines.push({
            "customerLineNumber": `${i}`,
            "ingramPartNumber": `${products.Sku}`,
            "quantity": 1
        })
    }

  const phone = Number(Phone)
  const phone2 = Number(Phone2)
  const price = Number(Price)
  let telephone = 0
  if(phone > 0 ){
    telephone = phone
  } else if(phone2 > 0){
    telephone = phone2
  }

  const address1 = Address1.substring(0,34)
//   console.log(address1)
  const address2 = Address2.substring(0,34)
  const estado = Region
  // const provincia = City
  const distrito = Ward
  const state = getEstado(estado)
 
  const objectForIngram = {
    "customerOrderNumber": `FB_${OrderNumber}`,
    "notes": "",
    "shipToInfo": {
        "contact": "",
        "companyName": `${FirstName} ${LastName}`.substring(0,34),
        "name1": `${FirstName}`,
        "name2": `${LastName}`,
        "addressLine1": `${address1}`, 
        "addressLine2": `${address2}`,
        "addressLine3": `${distrito}`,
        "addressLine4": `${telephone}`,
        "city": `${distrito}`.substring(0,19),
        "state": `${state}`,
        "countryCode": "PE",
        "phoneNumber": telephone,
    },
    "lines": lines,
    "shipmentDetails": {
       "shippingInstructions": `${Address4}`
    },
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
// console.log(objectForIngram)
return objectForIngram

}

async function sendOrderToIngramFalabella(orderId) {
  try {
    // crear hash signature para request 
    // @ts-ignore
    const [url, hash] = getSignature(orderId, 'GetOrder')
    // @ts-ignore
    const [urlItems, hashItems] = getSignature(orderId, 'GetOrderItems')
    const getUrl = 'https://sellercenter-api.falabella.com?' + url + '&Signature=' + hash
    const itemsUrl = 'https://sellercenter-api.falabella.com?' + urlItems + '&Signature=' + hashItems
    const headers=  { 
      headers: {
        'Accept': 'application/json'
      }
    }
    
    const order = await axios.get(getUrl, headers)
    // console.log(order.data)
    const items = await axios.get(itemsUrl, headers)
    
    const data = prepareDataForIngram(order.data, items.data)
    const config = await IngramHeaders()

    const ingramResponse = await axios.post(`${INGRAM_ORDER_URL}`, data, config)
    // console.log(ingramResponse.data.orders[0].ingramOrderNumber)
    return {request : data, ingram: ingramResponse.data}

  }
  catch (error) {
    console.log(error)
  }
}

module.exports = { prepareDataForIngram, sendOrderToIngramFalabella }