const {updateTokens} = require('../database/mercadolibre/tokens')
const {getTokens} = require('../tokens/ml')
async function createAndUpdateTokens(){
  try {
    // @ts-ignore
    const [apple, multimarcas] = await getTokens()
    if(typeof apple === 'undefined' || typeof multimarcas === 'undefined') return
    await updateTokens(apple, multimarcas)

  } catch (error) {
    console.log('error in tokensHelper')
  }
}

module.exports = {
  createAndUpdateTokens
}