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
      await axios.put(baseUrl, data, config);

    } catch (error) {
        console.log('not updatated itemid', arrayOfProducts[i].itemid, error.response.data.message)
        }
      }, j * 1000)
      }
      
    
  } catch (error) {
    console.log(error);
  }
  return 'finished'
}

module.exports = {
  putStock
}