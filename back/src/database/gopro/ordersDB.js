
require('dotenv').config()
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')

async function newGoProOrder({order_id, customerpo, nv, date}){
  const query = `INSERT INTO gopro_orders(order_id, customerpo, nv, date, disabled) VALUES ('${order_id}', '${customerpo}', '${nv}', '${date}', false)`
  const [rows] = await db.query(query)

  return rows
}
async function getGoProOrdersFromDB(today, yesterday){
  // const query = `SELECT * FROM gopro_orders WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id IS NULL or mercadopago_id = ''`
  const query = `SELECT * FROM gopro_orders WHERE mercadopago_id IS NULL or mercadopago_id = ''`
  const [rows] = await db.query(query)

  return rows
}
async function getGoProOrdersFromDates(yesterday, today){
  const query = `SELECT * FROM gopro_orders WHERE date BETWEEN '${yesterday}T13:00:00' AND '${today}T12:59:00' AND mercadopago_id IS NOT NULL`
  // const query = `SELECT * FROM gopro_orders WHERE mercadopago_id IS NULL or mercadopago_id = ''`
  const [rows] = await db.query(query)

  return rows
}

async function updateDeliveryGoPro({order, dispatcher, delivery}){
  const query = `UPDATE gopro_orders SET  delivery = '${delivery}', dispatcher_id = '${dispatcher}' WHERE order_id = '${order}'`
  const [rows] = await db.query(query)

  return rows
}

async function lookGoProOrder(ingramOrder) {
  const query = `SELECT * FROM gopro_orders WHERE nv = '${ingramOrder}'`
  const [rows] = await db.query(query)

  return rows
}

async function updateOrderGoProInDB(query) {
  await db.query(query)
}

async function updateFacturaGoPro(order_id) {
  const query = `UPDATE gopro_orders SET disabled = 'true' WHERE order_id = '${order_id}';`
  await db.query(query)
  return
}

async function getOrdersFromGoProInDatabase(order_id) {
  const query = `SELECT * FROM gopro_orders WHERE order_id = '${order_id}'`
  const [rows] = await db.query(query)

  return rows[0]
}

module.exports = {
  updateDeliveryGoPro,
  newGoProOrder,
  getGoProOrdersFromDB,
  lookGoProOrder,
  updateOrderGoProInDB,
  getGoProOrdersFromDates,
  updateFacturaGoPro,
  getOrdersFromGoProInDatabase
}