const { getAsusEntity } = require('../../database/asus/ordersDB')
const {default: axios} = require('axios')
const { lookGoProOrder } = require('../../database/gopro/ordersDB')
const { getShopifyOrderID } = require('../../database/xiaomi/ordersDB')
const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')
const { statusUpdateAsus } = require('../../services/asus/statusUpdateAsus')
const {updateTrackingNumberAndStatus} = require('../../services/asus/updateTracking')
const { deliveryGoProUpdate } = require('../../services/gopro/ordersService')
const { deliveryXiaomiUpdate } = require('../../services/xiaomi/ordersService')
const { getTokenAsus } = require('../../tokens/magento')
require('dotenv').config()
const {BEETRACK_AMAZE_CONTACT_ID, SHOPIFY_ACCESS_TOKEN_XIAOMI} = process.env


async function getDelivery(req, res) {
  res.status(200).send()
  // console.log(req.body)
  
  try {
    const {dispatch_guide, tags} = req.body
    console.log(req.body)
    if(dispatch_guide.contact_identifier === BEETRACK_AMAZE_CONTACT_ID){
      const isAsus = tags.find(tag => tag.name === "OC").value
      const OC = isAsus.split('_')[0]
      if(OC === "ESHOPASUS"){
        const delivery = tags.find(tag => tag.name === "Delivery").value
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        await updateTrackingNumberAndStatus({delivery: delivery, ingramOrder: ingramOrder, comment: `Guía de rastreo para tu pedido: ${delivery} en:\n https://amaze.com.pe/rastrea-tu-pedido/`, notify: 1})
      } else if(OC === "ULTIMAMILLA") {
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        const delivery = tags.find(tag => tag.name === "Delivery").value
        const order = await lookGoProOrder(ingramOrder)
        await deliveryGoProUpdate({order: order[0].order_id, dispatcher: dispatch_guide.guide, delivery: delivery})
      } else if(OC === "XIAOMI") {
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        const delivery = tags.find(tag => tag.name === "Delivery").value
        const order = await getShopifyOrderID(ingramOrder)
        const url = `https://xiaomistorepe.myshopify.com/admin/api/2022-04/orders/${order[0].order_id}.json`
        console.log(url)
        const config = {
          headers:{
            'X-Shopify-Access-Token' : `${SHOPIFY_ACCESS_TOKEN_XIAOMI}`
          }
        }
        const orderId = await axios.get(url, config)
        const lines = orderId.data.order.line_items.map(line => {return {id: line.id}})
        // const line_items = order[0].line_items.map(item => {})
        console.log(lines, delivery)
        const result = await deliveryXiaomiUpdate({order: order[0].order_id, lines, delivery: delivery})
        // res.status(200).json(result)
      }
    }
    
  } catch (error) {
    console.log('error en getDelivery Controller', error)
  }
}

async function completeDelivery(req, res) {
  res.status(200).send()
  try {
    const {contact_identifier, status, tags} = req.body

    if(contact_identifier === BEETRACK_AMAZE_CONTACT_ID && status === 2){
      const isAsus = tags.find(tag => tag.name === "OC").value
      const OC = isAsus.split('_')[0]
      if(OC === "ESHOPASUS"){
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        const order = await getAsusEntity(ingramOrder)
        console.log('entregado Asus pedido', order[0].order_id)
        await statusUpdateAsus({order: order[0].order_id, status: 'Done', comment: 'Tu pedido ha sido entregado', notify: 1})
        
      } 
    }
  } catch (error) {
    console.log(error, 'error in completeDelivery Asus')
  }
}


module.exports = {
  getDelivery,
  completeDelivery
}


