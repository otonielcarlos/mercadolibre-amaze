const {default: axios} = require('axios')
const {USER_MAGENTO, PASSWORD_MAGENTO}  = process.env
const {getAsusEntity} = require('../../database/asus/ordersDB')
const {getTokenAsus} = require('../../tokens/magento')
const {statusUpdateAsus} = require('./statusUpdateAsus')

async function updateTrackingNumberAndStatus({delivery, ingramOrder, comment, notify}){
  try {
  
  const token = await getTokenAsus()
  const order = await getAsusEntity(ingramOrder)
  let url = `https://pe.store.asus.com/index.php/rest/V1/orders/${order[0].order_id}`
  const orderItem = await axios.get(url, { headers: {'Authorization': `Bearer ${token}`}} )
  
  const items = orderItem.data.items.map(item => {
    const {item_id, qty_ordered} = item
    return {
      order_item_id: item_id,
      qty: qty_ordered
    }
  })
        const baseUrl = 'https://pe.store.asus.com/index.php/rest/V1/order/' + order[0].order_id + '/ship'
        const dataShip = {
              "items": items,
              "tracks": [
                {
                  "track_number": `${delivery}`,
                  "title": "Numero de seguimiento",
                  "carrier_code": "custom"
                }
              ]          
          }
          
          try {
            const sendShip = await axios.post(baseUrl, dataShip,{headers: { 'Authorization': `Bearer ${token}`}})
            const sendTransit = await statusUpdateAsus({order : order[0].order_id, status: 'inTransit', comment: comment, notify: notify})
            console.log(order[0].order_id ,sendShip.data, sendTransit)
            
          } catch (error) {
            console.log(error.response.data, order[0].order_id)
          }

      } catch (error) {
        console.log(error)
      }
}


module.exports = {
  updateTrackingNumberAndStatus
}