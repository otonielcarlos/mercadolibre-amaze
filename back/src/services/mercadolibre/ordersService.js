require('dotenv').config()
const {INGRAM_ORDER_URL, INGRAM_ORDER_URL_SANDBOX} = process.env
const {default: axios} = require('axios')
const {getOrders, findOrder, saveNewOrderID, saveIngram} = require('../../database/mercadolibre/ordersDB')
const {token} = require('../../tokens/ml')
const {prepareDataForIngramRequest, getOrderProps} = require('./orderUtils')
const {IngramHeaders} = require('../../headers/ingramHeaders')
const {getTokens} = require('../../database/mercadolibre/tokens')

async function getAllOrders(){
  const orders = await getOrders()
  return orders
}

async function findOrderWithID(id){
  const hasOrder = await findOrder(id)

  return hasOrder
}

async function saveOrderID(id){
  const isSaved = await saveNewOrderID(id)
  return isSaved
}

async function saveIngramOrder(orderProps, dataProps, account = 'APPLE'){
  try {
    const {models,
      productDescription,
      productPrices,
      productQuantity,
      skus} = orderProps

    const { globalorderid, customerPO, trackingNumber, orderId, name} = dataProps
    await saveIngram(globalorderid, customerPO, trackingNumber, orderId, name, skus, models, productDescription, productPrices, productQuantity, account)
    
  } catch (error) {
    console.log('error in saveIngramOrder (orderProps, dataProps)')
  }
}

async function getOrderDate(resource, account = 'APPLE'){
  try {
    try {
      let {mercadolibreapple, mercadolibremultimarcas} = await getTokens()
      let token = account === 'APPLE' ? mercadolibreapple : mercadolibremultimarcas
      // @ts-ignore
      let resDate = await axios.get(`https://api.mercadolibre.com/orders/${ resource }`, {
        headers: { Authorization: `Bearer ${ token }` },
      })
  
      let dateCreated = resDate.data.date_created
      let fullDate = dateCreated.slice(0, 10)
      //log(fullDate)
      return fullDate
    } catch (error)	{
     console.log(error.response.data)
    }
  } catch (error) {
    console.log(error.response.data, 'error in date.js')
  }
  }

  async function sendOrderToIngram(order_id, account){
    // const baseUrl = INGRAM_ORDER_URL_SANDBOX
  const baseUrl = INGRAM_ORDER_URL
  try {
    //DEFINIR CUENTA
    let {mercadolibreapple, mercadolibremultimarcas} = await getTokens()
    let token = account === 'APPLE' ? mercadolibreapple : mercadolibremultimarcas
    const co = account === 'APPLE' ? 'MLAPPLE' : 'ML'

    //OBTENER INFORMACION DE LA COMPRA CON LA CUENTA 
    const orderURL = `https://api.mercadolibre.com/orders/${order_id}`
    let order = await axios.get(orderURL,{ headers: {'Authorization': `Bearer ${token}`}})
    
    const data = await prepareDataForIngramRequest(order, account, token )
    

    //OBTENER HEADERS PARA INGRAM API REQUEST
    let config = await IngramHeaders()

    //INGRAM API REQUEST
    // @ts-ignore
    let responseFromIngram = await axios.post(baseUrl, data, config)
    console.log(responseFromIngram.data)

    const dataProps = {
      globalorderid: responseFromIngram.data.orders[0].ingramOrderNumber || 'error enviando a ingram',
      customerPO: responseFromIngram.data.customerOrderNumber,
      name: data.shipToInfo.name1,
      trackingNumber: "null",
      orderId: order_id,
    }

   

    const orderProps = getOrderProps(order.data, responseFromIngram.data)
    await saveIngramOrder(orderProps, dataProps, account)

    return dataProps
      } catch (error) {
        console.log(error.response.data)
  }
  }

async function sendOrderToIngramWithId(req){
  let order = req.params.orderid
	try {	
		const isApple = req.params.orderid === 'MLAPPLE'
		
		if(isApple){

		const id = order.slice(8)
		const orderRes = await sendOrderToIngram(id, 'APPLE')
		console.log(orderRes)
    return orderRes
		
	} else {

    const id = order.slice(3)
    console.log(id)
    const orderRes = await sendOrderToIngram(id, 'MULTIMARCAS')
    
    return orderRes

		}
	} catch (error) {
		console.log('error', error.response.data)
	}
}


module.exports = {
  getAllOrders, 
  findOrderWithID, 
  saveOrderID, 
  getOrderDate,
  sendOrderToIngram,
  sendOrderToIngramWithId
}