const axios = require('axios');
const { token } = require('../ml');
const log = console.log;
const fs = require('fs');
const { savePdfToServer } = require('../saveFtp');
const ftp = require('basic-ftp');
// const writer = fs.createWriteStream('./ticket.pdf')
const { db, getNullTickets, updateTracking, setCancel } = require('../db');

const getTicket = async (customerPO, shipmentId, accessToken) => {
  try {
    let url = `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipmentId}`;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

    const ticket = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    ticket.data.pipe(
      fs.createWriteStream(`back/src/etiqueta/${customerPO}.pdf`)
    );
    await savePdfToServer(`${customerPO}.pdf`);
  } catch (error) {
    log(error);
  }
  //   log(ticket.headers['content-disposition'].split("=")[1]);
};

const checkTickets = async () => {
  const accessToken = await token();
  let nullTickets = await getNullTickets();
  if (nullTickets.length > 0) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
    for (let i in nullTickets) {
      try {
        let shipmentId = await axios.get(
          `https://api.mercadolibre.com/orders/${nullTickets[i].id}`
        );
        let urlShipments =
          'https://api.mercadolibre.com/shipment_labels?shipment_ids=' +
          shipmentId.data.shipping.id;
        const ticket = await axios({
          url: urlShipments,
          method: 'GET',
          responseType: 'stream',
        });
        ticket.data.pipe(
          fs.createWriteStream(
            `back/src/etiqueta/${nullTickets[i].customerpo}.pdf`
          )
        );
        await savePdfToServer(`${nullTickets[i].customerpo}.pdf`);
        let trackingNumber = await axios.get(
          `https://api.mercadolibre.com/shipments/${shipmentId.data.shipping.id}`
        );
        await updateTracking(
          trackingNumber.data.tracking_number,
          nullTickets[i].id
        );
      } catch (error) {
        setCancel(nullTickets[i].id);
      }
    }
  } else {
    log('no hay nuevas etiquetas');
  }
};

// getTicket('ML_5067780851','41013952983','APP_USR-2796079999742920-120317-8eae4ba83d7fcc20ca662be0d746ac45-766642543');
module.exports = {
  //getTicket,
  checkTickets,
};
checkTickets();
