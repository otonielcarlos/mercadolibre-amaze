const { default: axios } = require('axios');
require('dotenv').config()
const { INGRAM_CLIENT_ID, INGRAM_CLIENT_SECRET} = process.env

const tokenUrl = 'https://api.ingrammicro.com:443/oauth/oauth30/token';
const postFields = `grant_type=client_credentials&client_id=${INGRAM_CLIENT_ID}&client_secret=${INGRAM_CLIENT_SECRET}`;
const headers = {
    headers: {
      Accept: 'application/json'
    },
  }

const ingramToken = async () => {
  // @ts-ignore
  try {
    const request = await axios.post(tokenUrl, postFields, headers);
    const token = request.data.access_token;
    console.log(token)
    return token;
    
  } catch (error) {
    console.log(error.response)
  }
}

module.exports = {
  ingramToken
}