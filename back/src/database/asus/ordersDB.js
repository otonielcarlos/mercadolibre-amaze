
require('dotenv').config()
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')

async function getAsusOrders(today, yesterday){
  // const query = `SELECT * FROM ingramorders_asus WHERE date BETWEEN '2022-12-28T13:00:00' AND '2022-12-29T12:59:00' AND mercadopago_id IS NULL or mercadopago_id = ''`
  const query = `SELECT * FROM ingramorders_asus WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id IS NULL or mercadopago_id = ''`
  const [rows] = await db.query(query)

  return rows
}
async function completeAsusOrdersInfo(query){
  const [rows] = await db.query(query)

  return rows
}

async function getAsusOrdersCompleted(today, yesterday){
  const query = `SELECT * FROM ingramorders_asus WHERE date BETWEEN '2022-09-09T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  // const query = `SELECT * FROM ingramorders_asus WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  const [rows] = await db.query(query)

  return rows
}
 // SELECT * FROM clientes WHERE id = ${id}
async function getAsusOrdersCompletedFromDates(today, yesterday){
  const query = `SELECT * FROM ingramorders_asus WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  // const query = `SELECT * FROM ingramorders_asus WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id != ''`
  // console.log(query)
  const [rows] = await db.query(query)

  return rows
}
async function getAsusEntity(ingramOrder){
  const query = `SELECT * FROM ingramorders_asus WHERE nv = '${ingramOrder}'`

  const [rows] = await db.query(query)

  return rows
}


async function updateFacturaStatus(order_id) {
const query = `UPDATE ingramorders_asus SET disabled = 'true' WHERE order_id = '${order_id}'`

const [rows] = await db.query(query)
console.log(rows)
}

async function checkAsusID(order_id) {
  let query = `SELECT order_id FROM asus_orderid WHERE order_id = '${order_id}'`;
  const [rows] = await db.query(query)
    // @ts-ignore
  if (rows.length > 0) {
    return (true);
  }
  return false
}

async function saveAsusId(order_id, day) {
	let query = `INSERT INTO asus_orderid VALUES ('${order_id}', '${day}')`
  
	const [rows] = await db.query(query)
	console.log(`id ${order_id} guardado con éxito`)
	return true
}

async function getIngramSku(sku){
  let query = `SELECT * from asus_ingrampartnumbers WHERE asusPartNumber = '${sku}'`
  const [rows] = await db.query(query)
  console.log(rows)
  return rows[0].ingramPartNumber

}

async function saveOrder (orderId, nv, customerpo, status, day) {
	const query = `INSERT INTO ingramorders_asus(order_id, nv, customerpo, status, date, disabled) VALUES('${orderId}','${nv}', '${customerpo}','${status}','${day}', 'false')`;
	await db.query(query)
};

module.exports = {
  getAsusOrders,
  completeAsusOrdersInfo,
  getAsusOrdersCompleted,
  getAsusOrdersCompletedFromDates,
  getAsusEntity,
  updateFacturaStatus,
  checkAsusID,
  saveAsusId,
  getIngramSku,
  saveOrder
}