const axios = require('axios');
const { token } = require('../ml');
const log = console.log;
const fs = require('fs');
const { savePdfToServer } = require('../saveFtp');
const ftp = require("basic-ftp")
// const writer = fs.createWriteStream('./ticket.pdf')



const getTicket = async (customerPO, shipmentId, accessToken) => {
  try {

    let url =
      `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipmentId}`;
 
    // const ticket = await axios.get(url, config);
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ accessToken;

    const ticket = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    ticket.data.pipe(fs.createWriteStream(`back/src/etiqueta/${customerPO}.pdf`))
    await savePdfToServer(`${customerPO}.pdf`)
  } catch (error) {
    log(error);
  }
  //   log(ticket.headers['content-disposition'].split("=")[1]);
};

// getTicket('ML_5067780851','41013952983','APP_USR-2796079999742920-120317-8eae4ba83d7fcc20ca662be0d746ac45-766642543');
module.exports = {
  getTicket
}
