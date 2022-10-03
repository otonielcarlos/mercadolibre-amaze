const {default: axios} = require('axios')
const { partsNumber } = require('./partsNumber')
const { sendMail } = require('./nodemailer')
const { saveOrder,getIngramSku } = require('./dbFunctions')
const fs = require('fs')
const { saveRequestResponse } = require('./saveFTP')
const { getStock, updateMagento } =  require('./pricesFunct')
const { excludeSkus } = require('./excludeSkus')
const { getState } = require('./helpers/getState')
const  {getData}  = require('./helpers/getDataForIngram')
// @ts-ignore
const log = console.log



const getOrderFromMagento = async (token, orderIdMagento) => {
  // let distrito = ''
  try {
    const urlOrders = `https://pe.store.asus.com/index.php/rest/V1/orders/${orderIdMagento}`
    let config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    // @ts-ignore
    let orders = await axios.get(urlOrders, config)

    let newOrder = orders.data
    let arrayOfProducts = []
    let products = newOrder.items

    function getUniqueListBy(arr, key) {
      return [...new Map(arr.map(item => [item[key], item])).values()]
    }
    let filteredItems = getUniqueListBy(products, 'sku')
    filteredItems.forEach(product => {
      arrayOfProducts.push({ quantity: product.qty_ordered, sku: product.sku, price: product.price })
    })

    let entityId = newOrder.entity_id
    let incrementId = newOrder.increment_id
    let customerPo = newOrder.entity_id
    let firstName = newOrder.extension_attributes.shipping_assignments[0].shipping.address.firstname
    let lastName = newOrder.extension_attributes.shipping_assignments[0].shipping.address.lastname
    let phoneNumber = newOrder.extension_attributes.shipping_assignments[0].shipping.address.telephone
    let streetAddress1 = newOrder.extension_attributes.shipping_assignments[0].shipping.address.street[0]
    let streetAddress2 = newOrder.extension_attributes.shipping_assignments[0].shipping.address.street[1]
    let street = ''
    if (typeof streetAddress2 !== 'undefined') {
      street = `${streetAddress1} ${streetAddress2}`
    } else {
      street = `${streetAddress1}`
    }

    const attributes = newOrder.extension_attributes.shipping_assignments[0].shipping.address.extension_attributes
    let distrito = ''
    if(attributes.hasOwnProperty('district')){
        distrito = attributes.district.substring(0,9)
    } else {
        distrito = ''
    }

    // let distrito = newOrder.extension_attributes.shipping_assignments[0].shipping.address.extension_attributes.district.substring(0,10)
    // if (distrito[9] === ' ') {
    //   distrito = distrito.substring(0, 9)
    // }
    let city = newOrder.extension_attributes.shipping_assignments[0].shipping.address.city
    let email = newOrder.extension_attributes.shipping_assignments[0].shipping.address.email
    let postalcode = newOrder.extension_attributes.shipping_assignments[0].shipping.address.postcode
    let region = newOrder.extension_attributes.shipping_assignments[0].shipping.address.region
    let status = newOrder.status
    let state = getState(region)

    let productsForIngram = []
    let i = 1

    for(let prod of arrayOfProducts){
      const ingramSku = await getIngramSku(prod.sku)
      productsForIngram.push({
        customerLineNumber: `${i}`,
        ingramPartNumber: ingramSku,
        quantity: prod.quantity,

      })
      i += 1
    }

    let firstname = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    let lastname = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    let address = street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    let addressline1 = ''
    let addressline2 = ''

    if (address.length > 35) {
      addressline1 = address.slice(0, 35)
      addressline2 = address.slice(35, address.length).substring(0, 34)
    } else {
      addressline1 = address
      addressline2 = ''
    }

    let fullName = `${firstname} ${lastname}`.substring(0, 34)

    let dataForIngramOrder = {
      orderId: customerPo,
      entityId: entityId,
      incrementId: incrementId,
      customerponumber: `eShopAsus_${incrementId}`,
      name1: `${fullName}`,
      name2: `${lastname}`,
      addressline1: `${addressline1}`,
      addressline2: `${addressline2}`,
      phonenumber: `${phoneNumber}`,
      city: `${city}`,
      state: `${state}`,
      email: `${email}`,
      distrito: `${distrito}`,
      postalcode: `${postalcode}`,
      lines: productsForIngram,
      status: `${status}`,
    }
    // console.log(dataForIngramOrder)
    return dataForIngramOrder
  } catch (error) {
   console.log(error)
    }
}


const sendOrderToIngram = async (dataForIngramOrder, token) => {
  try {
    const baseUrl = 'https://api.ingrammicro.com:443/resellers/v6/orders'

    const data = getData(dataForIngramOrder)
    console.log(JSON.stringify(data))
    // @ts-ignore
    let sendOrder = await axios.post(baseUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'IM-CustomerNumber': '325831',
        'IM-CountryCode' : 'PE',
        'IM-SenderID': 'Amaze',
        'IM-CorrelationID': 'fbac82ba-cf0a-4bcf-fc03-0c508457f219-bw0a102j',
        'Authorization': `Bearer ${token}`
      }
    })

    // console.log(data)
    
      let nv = sendOrder.data.orders[0].ingramOrderNumber
      
      const saveDate = new Date()
      saveDate.setHours(saveDate.getHours() - 6)
      let day = saveDate.toISOString().split('.')[0]
      // @ts-ignore
      await saveOrder(dataForIngramOrder.orderId,nv,dataForIngramOrder.customerponumber,dataForIngramOrder.status,day)

      // console.log(dataJson)
    
      let updatePurchaseSku = []
      data.lines.forEach(product => {
        if(!excludeSkus.includes(product.ingramPartNumber)){
        updatePurchaseSku.push({"ingramPartNumber": `${product.ingramPartNumber}`})
      }
      })

      let getProducts = getStock(updatePurchaseSku)
      let updateAfterPurchase = await updateMagento(getProducts)

      console.log(updateAfterPurchase)
      console.log( sendOrder.data.customerOrderNumber, ' - ', sendOrder.data.orders[0].ingramOrderNumber)
      return sendOrder.data
  } catch (error) {
    console.log('error in sendordertoingram function')
    console.log(error.response.data)
    
    
  }
}

module.exports = {
  sendOrderToIngram,
  getOrderFromMagento
}
