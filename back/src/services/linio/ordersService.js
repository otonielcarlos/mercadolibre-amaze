const {default:axios} = require('axios')
const { getEstado  } = require('../../helpers/getEstado')
const { IngramHeaders } = require('../../headers/ingramHeaders')
const { getSignature } = require('./orderUtils')
const { saveOrder, getOrdersFromLinioInDatabase, getLinioOrders, updateFacturaStatus } = require('../../database/linio/ordersDB')
const {INGRAM_ORDER_URL} = process.env

function prepareDataForIngram(order, items){
  const {OrderNumber, Price} = order.SuccessResponse.Body.Orders.Order
  const {FirstName, LastName, Phone, Phone2, Address1, Address2, Address3, Address4, City} = order.SuccessResponse.Body.Orders.Order.AddressShipping
    
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
  const estado = City.split(',')[1].trim()
  const provincia = City.split(',')[0].trim()
  const distrito = City.split(',')[2].trim()
  const state = getEstado(estado)
 
  const objectForIngram = {
    "customerOrderNumber": `LN_${OrderNumber}`,
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

async function sendOrderToIngramLinio(orderId) {
  try {
    // crear hash signature para request 
    // @ts-ignore
    const [url, hash] = getSignature(orderId, 'GetOrder')
    // @ts-ignore
    const [urlItems, hashItems] = getSignature(orderId, 'GetOrderItems')
    const getUrl = 'https://sellercenter-api.linio.com.pe?' + url + '&Signature=' + hash
    const itemsUrl = 'https://sellercenter-api.linio.com.pe?' + urlItems + '&Signature=' + hashItems
    const headers=  { 
      headers: {
        'Accept': 'application/json'
      }
    }
    
    const order = await axios.get(getUrl, headers)
    const items = await axios.get(itemsUrl, headers)
    

    const data = prepareDataForIngram(order.data, items.data)
    const config = await IngramHeaders()
    
    const ingramResponse = await axios.post(`${INGRAM_ORDER_URL}`, data, config)

    const nv = ingramResponse.data.orders[0].ingramOrderNumber
    await saveOrderLinio(order.data, items.data, nv)
    return {request : data, ingram: ingramResponse.data}
    // return {request : data}

  }
  catch (error) {
    console.log(error)
  }
}

async function saveOrderLinio(billing, items, nv) {
  try {
    const {FirstName, LastName, Phone, Address1, Address2, Address3, Address4, CustomerEmail, Ward, Region} = billing.SuccessResponse.Body.Orders.Order.AddressBilling
    const {InvoiceRequired, NationalRegistrationNumber, ItemsCount, Price, CreatedAt, OrderNumber, OrderId} = billing.SuccessResponse.Body.Orders.Order
    let products = items.SuccessResponse.Body.OrderItems.OrderItem
    let itemsSku = ''
    let itemsNames = ''
    if(Array.isArray(products)){
        products.forEach(product => {
          itemsSku += `${product.Sku}, `
          itemsNames += `${product.Name}, `
        })
    } else {
      itemsSku += `${products.Sku}`
      itemsNames += `${products.Name}`
    }
    const addressInfo = [Address1, Address2, Address3, Address4, Ward, Region]
    const name = `${FirstName} ${LastName}`
    let address = ''
    addressInfo.forEach((info) => {
      if(info.length > 0) {
        address += `${info}, `
      }
    })
    const hasPhone = Phone.length > 0 ? Phone : 'N/A'
    address += `Peru, T: ${hasPhone}`
    const date = CreatedAt.split(' ')[0]
    const customerPO = `LN_${OrderNumber}`
    const requiereFactura = InvoiceRequired === "true" ? 'Sí' : ' No'
    const orderData = {OrderId, name, address, nv, CustomerEmail, requiereFactura, NationalRegistrationNumber, ItemsCount, Price, date, customerPO, itemsSku, itemsNames}
    await saveOrder(orderData)


  } catch (error) {
    console.log(error, 'error grabando orden de LinioPE en Base de Datos')
  }
}

async function getOrdersFromLinio() {
  const orders = await getOrdersFromLinioInDatabase()
  return orders
}
async function linioOrdersFromDates(yesterday, today) {
  const orders = await getLinioOrders(yesterday, today)
  return orders
}

async function updateOrderStatusFactura(order_id) {
  await updateFacturaStatus(order_id)


}

module.exports = { 
  prepareDataForIngram,
  sendOrderToIngramLinio,
  getOrdersFromLinio,
  linioOrdersFromDates,
  updateOrderStatusFactura
 }