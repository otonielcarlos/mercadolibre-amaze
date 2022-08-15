const {default: axios} = require('axios')
const {getSignature} = require('./hash')
const {prepareDataForIngram} = require('./prepareDataForIngram')
const {IngramHeaders} = require('../src/headers/ingramHeaders')

const ingramUrl = 'https://api.ingrammicro.com:443/resellers/v6/orders'

async function sendOrderToIngramLinio(orderId) {
  try {
    // crear hash signature para request 
    // @ts-ignore
    const {url, hash} = getSignature(orderId, 'GetOrder')
    // @ts-ignore
    const {urlItems, hashItems} = getSignature(orderId, 'GetOrderItems')
    const getUrl = 'https://sellercenter-api.linio.com.pe?' + url + '&Signature=' + hash
    const itemsUrl = 'https://sellercenter-api.linio.com.pe?' + urlItems + '&Signature=' + hashItems
    
    const order = await axios.get(getUrl, {headers: {'Accept': 'application/json'}} )
    const items = await axios.get(itemsUrl, {headers: {'Accept': 'application/json'}} )
    
    const data = prepareDataForIngram(order.data, items.data)
    console.log(data)
    const config = await IngramHeaders()

    const ingramResponse = await axios.post(ingramUrl, data, config)
    console.log(ingramResponse.data)
    return {request : data, ingram: ingramResponse.data}

  }
  catch (error) {
    console.log(error)
  }
}
  module.exports = {
    sendOrderToIngramLinio
  }