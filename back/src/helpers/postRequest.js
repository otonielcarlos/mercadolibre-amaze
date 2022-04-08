const axios = require('axios');
const { token } = require('../tokens/ml')
const log = console.log;


const putStock = async (arrayOfProducts) => {
  try {
    let j = 0;
    const accessToken = await token();
    for(let i in arrayOfProducts){
      j++;
      let baseUrl =  `https://api.mercadolibre.com/items/${arrayOfProducts[i].itemid}`
      setTimeout(async() => {
      try {
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      };
      let data = arrayOfProducts[i].data
      // @ts-ignore
      const sendStock = await axios.put(baseUrl, data, config);
     log(sendStock.data.id)
    } catch (error) {
        log('not updatated itemid', arrayOfProducts[i].itemid, error.response.data.message)
        }
      }, j * 1000)
      }
      
    
  } catch (error) {
    log(error);
  }
  return 'finished'
}

module.exports = {
  putStock
}