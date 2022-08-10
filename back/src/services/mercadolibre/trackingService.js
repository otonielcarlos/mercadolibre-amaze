// @ts-nocheck
const { default: axios } = require('axios')
const { token } = require('../tokens/ml')
const log = console.log
const fs = require('fs')
// const writer = fs.createWriteStream('./ticket.pdf')
const {  getNullTickets, updateTracking } = require('../database/trackingDB')

 async function checkTracking(account) {
	const accessToken = await token(account)
	let ordersWithNullTracking = await getNullTickets(account)
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
	if (ordersWithNullTracking.length > 0) {
		for (let order of ordersWithNullTracking) {
			try {
        let shipmentId = await axios.get(`https://api.mercadolibre.com/orders/${order.id}`)
				// let urlShipments = 'https://api.mercadolibre.com/shipment_labels?shipment_ids=' + shipmentId.data.shipping.id
        
      //   const ticket = await axios({
      //     url: urlShipments,
      //     method: 'GET',
      //     responseType: 'stream',
      // })
        
				// ticket.data.pipe(fs.createWriteStream(`back/src/etiqueta/${nullTickets[i].customerpo}.pdf`))
				// await savePdfToServer(`${nullTickets[i].customerpo}.pdf`)
				let shippingInfo = await axios.get(`https://api.mercadolibre.com/shipments/${shipmentId.data.shipping.id}`)
				const {tracking_number, receiver_address} = shippingInfo.data
				const shippingAddress = `${receiver_address.address_line},\n ${receiver_address.city.name},\n ${receiver_address.street_name},\n ${receiver_address.neighborhood.name},\n ${receiver_address.state.name},\n ${receiver_address.comment}\n`
				

				await updateTracking(tracking_number, order.id, shippingAddress)
      
    } catch (error) {
				// setCancel(order.id)
				console.log(error.response.data)
			}
		}
	} else {
		log('no hay nuevos tracking numbers')
	}
}

module.exports = {
	checkTracking,
}

