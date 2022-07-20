
require('dotenv').config()
const { default: axios } = require('axios')
const { token } = require('../tokens/ml')
const { IngramHeaders } = require('../headers/ingramHeaders')
const { saveIngram } = require('./db')
const { getEstado } = require('./getEstado')
const { INGRAM_ORDER_URL, INGRAM_ORDER_URL_SANDBOX } = process.env
// const { getTicket } = require('./etiqueta/printTicket')


async function addOrder(resource, account) {
  // const baseUrl = INGRAM_ORDER_URL_SANDBOX
  const baseUrl = INGRAM_ORDER_URL
  try {
    //DEFINIR CUENTA
    const co = account === 'APPLE' ? 'MLAPPLE' : 'MULTIMARCAS'

    // OBTENER TOKEN
    let access_token = await token(account)

    //OBTENER INFORMACION DE LA COMPRA CON LA CUENTA 
    const orderURL = `https://api.mercadolibre.com/orders/${resource}`
    let order = await axios.get(orderURL,{ headers: {'Authorization': `Bearer ${access_token}`}})
    let shippingURL = `https://api.mercadolibre.com/shipments/${order.data.shipping.id}`
    let shipping = await axios.get(shippingURL, { headers: {'Authorization': `Bearer ${access_token}`}})
    let citye = shipping.data.receiver_address.city.name
    let cityFinal = shipping.data.receiver_address.city.name

    //DEFINIR EL CODIGO DE ESTADO
    const finalState = getEstado(citye)
     
    const id = order.data.id;
    const customerPo = `${co}_${id}`;

    const address = shipping.data.receiver_address.address_line;

    //RETIRAR ACENTOS Y CARACTERES LATINOS DEL NOMBRE
    const shipTo = address.normalize('NFD').replace(/[\u0300-\u036f]/g, "") 

    const fName = order.data.buyer.first_name
    const firstName = fName.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    const sName = order.data.buyer.last_name
    const lastName = sName.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    const name1 = `${firstName} ${lastName}`


    //OBTENER INFORMACION DE LOS PRODUCTOS
    const lines = order.data.order_items.map((product, lineNumber) => {
      return  {
        "customerLineNumber": lineNumber + 1,
        "ingramPartNumber":  `${product.item.seller_sku}`,
        "quantity": `${product.quantity}`,
    }
    })
       
    
    let addressline1 = '' 
    let addressline2 = ''
    let addressline3 = ''

    if(shipTo.length > 35){
      addressline1 = shipTo.slice(0, 35)
      addressline2 = shipTo.slice(36, shipTo.length)
    } else {
      addressline1 = shipTo
      addressline2 = ''
    }
    
    if(addressline2.length > 40) {
      addressline2 = shipTo.slice(36, 70)
      addressline3 = shipTo.slice(70, shipTo.length)
    } else{
      addressline2 = shipTo.slice(36, 70)
      addressline3 = ''
    }

let config = await IngramHeaders()
let data = {
  "customerOrderNumber":`${customerPo}`,
  "notes": "",
  "shipToInfo": {
      "contact": `${name1.substring(0,35)}`,
      "companyName": `${name1.substring(0,35)}`,
      "name1": `${name1.substring(0,35)}`,
      "addressLine1": `${addressline1}`,
      "addressLine2": `${addressline2}`,
      "addressLine3": `${addressline3}`,
      "city":`${cityFinal}`,
      "state": `${finalState}`,
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


console.log(JSON.stringify(data))
// @ts-ignore
let responseFromIngram = await axios.post(baseUrl, data, config)
console.log(responseFromIngram.data.orders)

const dataToReturn = {
  globalorderid: responseFromIngram.data.orders[0].ingramOrderNumber || 'error enviando a ingram',
  customerPO: responseFromIngram.data.customerOrderNumber,
  name: data.shipToInfo.name1,
  shippingAddress: `${data.shipToInfo.name1}\n ${data.shipToInfo.addressLine1}\n ${data.shipToInfo.addressLine2}\n ${data.shipToInfo.addressLine3}\n ${data.shipToInfo.city}`,
  trackingNumber: "null",
  orderId: id,
  request: data,
  ingram: responseFromIngram.data
}

const models = responseFromIngram.data.orders[0].lines.map(line => line.vendorPartNumber).join()
const productDescription = order.data.order_items.map((product) => {
  return `${product.item.title}\n`
}).join()

const productPrices = order.data.order_items.map((product) => {
  return `${product.unit_price}\n`
}).join()

const productQuantity = order.data.order_items.map((product) => {
  return `${product.quantity}\n`
}).join()

const skus = order.data.order_items.map((product) => {
  return `${product.item.seller_sku}\n`
}).join()



const { globalorderid, customerPO, trackingNumber, orderId, name} = dataToReturn
await saveIngram(globalorderid, customerPO, trackingNumber, orderId, name, skus, models, productDescription, productPrices, productQuantity, account)
// console.log(dataToReturn)
return dataToReturn
  } catch (error) {
    console.log(error.data)
    // sendMail(id)
  }
}

module.exports = { addOrder }


