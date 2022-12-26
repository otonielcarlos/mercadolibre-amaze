
require('dotenv').config()
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')

async function getAsusOrders(today, yesterday){
  const query = `SELECT * FROM ingramorders_liniope WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id IS NULL or mercadopago_id = ''`
  const [rows] = await db.query(query)

  return rows
}
async function completeAsusOrdersInfo(query){
  const [rows] = await db.query(query)

  return rows
}

async function getAsusOrdersCompleted(today, yesterday){
  const query = `SELECT * FROM ingramorders_liniope WHERE date BETWEEN '2022-09-09T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  // const query = `SELECT * FROM ingramorders_liniope WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  const [rows] = await db.query(query)

  return rows
}
 // SELECT * FROM clientes WHERE id = ${id}
async function getAsusOrdersCompletedFromDates(today, yesterday){
  const query = `SELECT * FROM ingramorders_liniope WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  // const query = `SELECT * FROM ingramorders_liniope WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  // console.log(query)
  const [rows] = await db.query(query)

  return rows
}



async function updateFacturaStatus(order_id) {
const query = `UPDATE ingramorders_liniope SET disabled = 'true' WHERE order_id = '${order_id}'`

const [rows] = await db.query(query)
console.log(rows)
}




async function saveOrder (orderId, nv, customerpo, status, day) {
	const query = `INSERT INTO ingramorders_liniope(order_id, nv, customerpo, status, date, disabled) VALUES('${orderId}','${nv}', '${customerpo}','${status}','${day}', 'false')`;
	await db.query(query)
};

module.exports = {
  getAsusOrders,
  completeAsusOrdersInfo,
  getAsusOrdersCompleted,
  getAsusOrdersCompletedFromDates,
  updateFacturaStatus,
  saveOrder
}