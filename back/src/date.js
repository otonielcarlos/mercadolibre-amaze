const axios = require('axios');
const { token } = require('./ml');

const getDate = async resource => {
  try {
    let accessToken = await token();
    let resDate = await axios.get(`https://api.mercadolibre.com/${resource}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    let dateCreated = resDate.data.date_created;
    let fullDate = dateCreated.slice(0, 10);
    console.log(fullDate);
    return fullDate;
  } catch (error) {
    console.log('error getting date in date.js file');
  }
};
// getDate('orders/5081792652');
module.exports = {
  getDate,
};
