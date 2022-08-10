
require('dotenv').config()
const db = require('./db')
const {getToday, getTodayAndYesterday} = require('./utilsdate')


async function getNullTickets(account){
  let query = `SELECT * from ingramorders WHERE tracking = 'null' AND account = '${account}'`
  const [rows] = await db.query(query)
  
  return rows
}

async function getTickets() {
    let query = "SELECT nv as 'nota_de_venta', id as 'id_mercadolibre', customerpo, tracking as 'guia_rastreo', date as 'fecha' from ingramorders WHERE display = 'true' ORDER BY date DESC"
    const [rows] = await db.query(query)

    return rows
}

async function updateTracking (trackingNumber, id, shippingAddress) {
  const query = `UPDATE ingramorders SET tracking = '${trackingNumber}', display = 'true', address = '${shippingAddress}' WHERE id = ${id}`
  const [rows] = await db.query(query)

  return rows
}

module.exports = {
  getNullTickets,
  getTickets,
  updateTracking
}