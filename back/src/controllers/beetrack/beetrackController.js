const { getAsusEntity } = require('../../database/asus/ordersDB')
const { lookGoProOrder } = require('../../database/gopro/ordersDB')
const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')
const { statusUpdateAsus } = require('../../services/asus/statusUpdateAsus')
const {updateTrackingNumberAndStatus} = require('../../services/asus/updateTracking')
const { deliveryGoProUpdate } = require('../../services/gopro/ordersService')
const { getTokenAsus } = require('../../tokens/magento')
require('dotenv').config()
const {BEETRACK_AMAZE_CONTACT_ID} = process.env


async function getDelivery(req, res) {
  res.status(200).send()
  
  try {
    const {dispatch_guide, tags} = req.body
    console.log(req.body)
    if(dispatch_guide.contact_identifier === BEETRACK_AMAZE_CONTACT_ID){
      const isAsus = tags.find(tag => tag.name === "OC").value
      const OC = isAsus.split('_')[0]
      if(OC === "ESHOPASUS"){
        const delivery = tags.find(tag => tag.name === "Delivery").value
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        await updateTrackingNumberAndStatus({delivery: delivery, ingramOrder: ingramOrder, comment: `Guía de rastreo para tu pedido: ${delivery}`, notify: 1})
      } else if(OC === "ULTIMAMILLA") {
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        const delivery = tags.find(tag => tag.name === "Delivery").value
        const order = await lookGoProOrder(ingramOrder)
        await deliveryGoProUpdate({order: order[0].order_id, dispatcher: dispatch_guide.guide, delivery: delivery})
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


