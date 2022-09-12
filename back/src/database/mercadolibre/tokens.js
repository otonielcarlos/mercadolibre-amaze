
require('dotenv').config()
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')



async function getTokens() {

  const query = `SELECT * FROM tokens`
  const [rows] = await db.query(query)
  if(rows){
    return rows[0]
  }
    console.log('error getTokens from Database')
  }

async function updateTokens(tokenApple, tokenMultimarcas) {

  const query = `UPDATE tokens SET mercadolibreapple = '${tokenApple}', mercadolibremultimarcas = '${tokenMultimarcas}'`
  const [rows] = await db.query(query)
  if(rows){
    return 'tokens updated'
  }
    console.log('error in stock update')
  }
  
module.exports = {
  updateTokens,
  getTokens
}
