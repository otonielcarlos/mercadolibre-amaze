const {default:axios} = require('axios')
const { getState } = require('../state/getState')

function prepareDataForIngram(order, items){
  console.log(order.SuccessResponse.Body.Orders)
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
  const state = getState(estado)
 
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

module.exports = { prepareDataForIngram }