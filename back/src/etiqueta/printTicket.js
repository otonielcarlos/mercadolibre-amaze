const axios = require('axios');
const { token } = require('../ml');
const log = console.log;
const fs = require('fs')
// const writer = fs.createWriteStream('./ticket.pdf')


const getTicket = async () => {
  try {
    const accessToken = await token();

    let url =
      'https://api.mercadolibre.com/shipment_labels?shipment_ids=41009544296';
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/pdf",
        "responseType": "stream"
      },
    };
    // const ticket = await axios.get(url, config);
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ accessToken;

    const ticket = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    const preName = ticket.headers['content-disposition'].split('=')[1];
    const name = preName.split('"')[1];
    ticket.data.pipe(fs.createWriteStream(`./${name}`))

  } catch (error) {
    log(error);
  }
  //   log(ticket.headers['content-disposition'].split("=")[1]);
};

getTicket();
