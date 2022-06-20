const {ingramToken} = require('../tokens/ingramToken')

async function IngramHeaders() {
  try{  const token = await ingramToken()

    let data = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'IM-CustomerNumber': '325831',
          'IM-CorrelationID': 'fbac82ba-cf0a-4bcf-fc03-0c508457f219-bw0a102j',
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