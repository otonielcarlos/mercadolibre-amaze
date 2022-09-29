
require('dotenv').config()
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')

async function newGoProOrder({order_id, customerpo, nv}){
  const query = `INSERT INTO gopro_orders(order_id, customerpo, nv) VALUES ('${order_id}', '${customerpo}', '${nv}')`
  const [rows] = await db.query(query)

  return rows
}
async function getGoProOrders(today, yesterday){
  const query = `SELECT * FROM gopro_orders WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id IS NULL or mercadopago_id = ''`
  const [rows] = await db.query(query)

  return rows
}

module.exports = {
  newGoProOrder
}