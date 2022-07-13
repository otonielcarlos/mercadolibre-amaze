const {ingramToken} = require('../tokens/ingramToken')
require('dotenv').config()
const {INGRAM_CLIENT_CUSTOMER, INGRAM_CORRELATION_ID} = process.env

async function IngramHeaders() {
  try{  const token = await ingramToken()

    let data = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'IM-CustomerNumber': INGRAM_CLIENT_CUSTOMER,
          'IM-CorrelationID': INGRAM_CORRELATION_ID,
          'IM-CountryCode': 'PE',
          Authorization: `Bearer ${token}`,
        }
    }

    return data
    } catch(err){
      console.log(err)
    }
}

module.exports = { IngramHeaders }