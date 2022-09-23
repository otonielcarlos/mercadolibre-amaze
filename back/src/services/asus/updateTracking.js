const {default: axios} = require('axios')
const {USER_MAGENTO, PASSWORD_MAGENTO}  = process.env
const {getAsusEntity} = require('../../database/asus/ordersDB')

async function updateTrackingNumberAndStatus({delivery, ingramOrder}){
  try {
    const token = await axios.post('https://pe.store.asus.com/index.php/rest/V1/integration/admin/token',{
      "username": `${USER_MAGENTO}`,
      "password": `${PASSWORD_MAGENTO}`
  })

  const order = await getAsusEntity(ingramOrder)
  let url = `https://pe.store.asus.com/index.php/rest/V1/orders/${order[0].order_id}`
  const orderItem = await axios.get(url, { headers: {'Authorization': `Bearer ${token.data}`}} )
  
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
                  "title": "Tracking Number",
                  "carrier_code": "custom"
                }
              ]          
          }
          // console.log(dataShip)
          const saveDate = new Date()
          saveDate.setHours(saveDate.getHours() - 6)
          let day = saveDate.toISOString().split('T')[0]
          let time = saveDate.toISOString().split('T')[1].split('.')[0]
          let created_at = `${day} ${time}`
        
          const postUrl = `https://pe.store.asus.com/index.php/rest/V1/orders/${order[0].order_id}/comments`
					let dataForUpdate = {
						statusHistory: {
							comment: '',
							created_at: `${created_at}`,
							parent_id: order[0].order_id,
							is_customer_notified: 0,
							is_visible_on_front: 0,
							status: 'InTransit',
						},
					}
          try {
            const sendShip = await axios.post(baseUrl, dataShip,{headers: { 'Authorization': `Bearer ${token.data}`}})
            const sendDone = await axios.post(postUrl, dataForUpdate, {headers: { 'Authorization': `Bearer ${token.data}`}})
            console.log(order[0].order_id ,sendShip.data, sendDone.data)
            
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