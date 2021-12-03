const axios = require('axios');
const { token } = require('../ml');
const log = console.log;
const fs = require('fs');
const { savePdfToServer } = require('../saveFtp');
const ftp = require("basic-ftp")
// const writer = fs.createWriteStream('./ticket.pdf')
const { savePdfToServer } = require('../saveFtp')


<<<<<<< HEAD
const getTicket = async (shipmentId) => {
=======
const getTicket = async (customerPO, shipmentId, accessToken) => {
>>>>>>> pdfbranch
  try {

    let url =
      `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipmentId}`;
<<<<<<< HEAD
    
=======
 
>>>>>>> pdfbranch
    // const ticket = await axios.get(url, config);
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ accessToken;

    const ticket = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
<<<<<<< HEAD
    const preName = ticket.headers['content-disposition'].split('=')[1];
    const name = preName.split('"')[1];
    ticket.data.pipe(fs.createWriteStream(`./back/src/etiqueta/${name}`))
    await savePdfToServer(name)
=======

    ticket.data.pipe(fs.createWriteStream(`back/src/etiqueta/${customerPO}.pdf`))
    await savePdfToServer(`${customerPO}.pdf`)
>>>>>>> pdfbranch
  } catch (error) {
    log(error);
  }
  //   log(ticket.headers['content-disposition'].split("=")[1]);
};

<<<<<<< HEAD
getTicket(41006579058);
=======
// getTicket('ML_5067780851','41013952983','APP_USR-2796079999742920-120317-8eae4ba83d7fcc20ca662be0d746ac45-766642543');
module.exports = {
  getTicket
}
>>>>>>> pdfbranch
