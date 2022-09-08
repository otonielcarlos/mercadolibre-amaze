const {default: axios} = require('axios')
require('dotenv').config()
const {USER_MAGENTO,
  PAASSWORD_MAGENTO, MAGENTO_URL} = process.env
async function getTokenAsus(){
  try {
    const body = {
      "username": `${USER_MAGENTO}`,
      "password": `${PAASSWORD_MAGENTO}`
  }
    const dataToken = await axios.post(`${MAGENTO_URL}`, body)
  return dataToken.data
  } catch (error) {
    console.log('error in token magento')
  }
}

module.exports = {
  getTokenAsus
}