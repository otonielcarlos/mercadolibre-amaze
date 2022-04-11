// @ts-nocheck
const { default: axios } = require('axios');
const { token } = require('../tokens/ml');
const log = console.log;
const fs = require('fs');
const { savePdfToServer } = require('../saveFtp');
const ftp = require('basic-ftp');
// const writer = fs.createWriteStream('./ticket.pdf')
const { db, getNullTickets, updateTracking, setCancel } = require('../db');

const checkTickets = async () => {
	const accessToken = await token();
	let nullTickets = await getNullTickets();
	if (nullTickets.length > 0) {
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
		for (let i in nullTickets) {
			try {
        let shipmentId = await axios.get(`https://api.mercadolibre.com/orders/${nullTickets[i].id}`);
				let urlShipments = 'https://api.mercadolibre.com/shipment_labels?shipment_ids=' + shipmentId.data.shipping.id;
        
        const ticket = await axios({
          url: urlShipments,
          method: 'GET',
          responseType: 'stream',
      });
        
				ticket.data.pipe(fs.createWriteStream(`back/src/etiqueta/${nullTickets[i].customerpo}.pdf`));
				await savePdfToServer(`${nullTickets[i].customerpo}.pdf`);
				let trackingNumber = await axios.get(`https://api.mercadolibre.com/shipments/${shipmentId.data.shipping.id}`);
				await updateTracking(trackingNumber.data.tracking_number, nullTickets[i].id);
      
    } catch (error) {
				setCancel(nullTickets[i].id);
			}
		}
	} else {
		log('no hay nuevas etiquetas');
	}
};

module.exports = {
	checkTickets,
};
