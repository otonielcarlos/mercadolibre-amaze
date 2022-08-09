const{default:axios} = require('axios')
const {getEstado} = require('../helpers/getEstado')
const {IngramHeaders} = require('../headers/ingramHeaders')



async function prepareDataForIngramRequest(order, account = 'APPLE',token) {
let shippingURL = `https://api.mercadolibre.com/shipments/${order.data.shipping.id}`
let shipping = await axios.get(shippingURL, { headers: {'Authorization': `Bearer ${token}`}})
let citye = shipping.data.receiver_address.city.name
let cityFinal = shipping.data.receiver_address.city.name

//DEFINIR EL CODIGO DE ESTADO
const finalState = getEstado(citye)
 
const id = order.data.id;
const customerPo = (account === 'APPLE' ? 'MLAPPLE_' : 'ML')

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


//BODY REQUEST DE INGRAM API
let data = {
  "customerOrderNumber":`${customerPo}`,
  "notes": "",
  "shipToInfo": {
      "contact": `${name1.substring(0,34)}`,
      "companyName": `${name1.substring(0,34)}`,
      "name1": `${name1.substring(0,34)}`,
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

return data

}


function getOrderProps(order, response) {
  
  const models = response.orders[0].lines.map(line => line.vendorPartNumber).join()
  const productDescription = order.order_items.map((product) => {
    return `${product.item.title}\n`
  }).join()

  const productPrices = order.order_items.map((product) => {
    return `${product.unit_price}\n`
  }).join()

  const productQuantity = order.order_items.map((product) => {
    return `${product.quantity}\n`
  }).join()

  const skus = order.order_items.map((product) => {
    return `${product.item.seller_sku}\n`
  }).join()

  return {
    models,
    productDescription,
    productPrices,
    productQuantity,
    skus
  
  }
}

module.exports = {
  prepareDataForIngramRequest,
  getOrderProps
}