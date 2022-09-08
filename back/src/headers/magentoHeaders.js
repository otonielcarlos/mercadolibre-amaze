const {getTokenAsus} = require('../tokens/magento')

async function magentoHeaders(){
  try {
    const token = await getTokenAsus()

    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  } catch (error) {
    console.log('error in magentoHeaders')
  }
}

module.exports = {
  magentoHeaders
}