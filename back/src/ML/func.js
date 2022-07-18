
require('dotenv').config()
const { default: axios } = require('axios')
const { token } = require('../tokens/ml')
const { IngramHeaders } = require('../headers/ingramHeaders')
const { saveIngram } = require('./db')
const { getEstado } = require('./getEstado')
const { INGRAM_ORDER_URL, INGRAM_ORDER_URL_SANDBOX } = process.env
// const { getTicket } = require('./etiqueta/printTicket')

// let baseUrl = INGRAM_ORDER_URL_SANDBOX
const baseUrl = INGRAM_ORDER_URL

async function addOrder(resource) {
  try {
    console.log(resource)
    let access_token = await token()
    const orderURL = `https://api.mercadolibre.com/orders/${resource}`
    let order = await axios.get(orderURL,{ headers: {'Authorization': `Bearer ${access_token}`}})
    let shippingURL = `https://api.mercadolibre.com/shipments/${order.data.shipping.id}`
    let shipping = await axios.get(shippingURL, { headers: {'Authorization': `Bearer ${access_token}`}})
    let citye = shipping.data.receiver_address.city.name
    let cityFinal = shipping.data.receiver_address.city.name
    let state = shipping.data.receiver_address.state.name
    let stateFinal = shipping.data.receiver_address.state.name

    let finalState = getEstado(citye)
     
    const id = order.data.id;
    const customerPo = `MLAPPLE_${id}`;

    const address = shipping.data.receiver_address.address_line;
    const shipTo = address.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ;

    const fName = order.data.buyer.first_name;
    const firstName = fName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    const sName = order.data.buyer.last_name;
    const lastName = sName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    const name1 = `${firstName} ${lastName}`

    const lines = order.data.order_items.map((product, lineNumber) => {
      return  {
        "customerLineNumber": lineNumber + 1,
        "ingramPartNumber":  `${product.item.seller_sku}`,
        "quantity": `${product.quantity}`,
    }
    })
    
    let addressline1 = '' 
    let addressline2 = '';
    let addressline3 = '';

    if(shipTo.length > 35){
      addressline1 = shipTo.slice(0, 35);
      addressline2 = shipTo.slice(36, shipTo.length);
    } else {
      addressline1 = shipTo
      addressline2 = '';
    }
    
    if(addressline2.length > 40) {
      addressline2 = shipTo.slice(36, 70);
      addressline3 = shipTo.slice(70, shipTo.length);
    } else{
      addressline2 = shipTo.slice(36, 70);
      addressline3 = ''
    }

let config = await IngramHeaders();
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
let responseFromIngram = await axios.post(baseUrl, data, config)
console.log(responseFromIngram.data.orders)

const dataToReturn = {
  globalorderid: responseFromIngram.data.orders[0].ingramOrderNumber,
  customerPO: responseFromIngram.data.customerOrderNumber,
  trackingNumber: "null",
  orderId: id,
  request: data,
  ingram: responseFromIngram.data
}
const { globalorderid, customerPO, trackingNumber, orderId} = dataToReturn
await saveIngram(globalorderid, customerPO, trackingNumber, orderId)
// console.log(dataToReturn)
return dataToReturn
  } catch (error) {
    console.log(error.data)
    // sendMail(id)
  }
}

module.exports = { addOrder }