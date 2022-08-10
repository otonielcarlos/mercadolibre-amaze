
require('dotenv').config()
const db = require('./db')
const {getToday, getTodayAndYesterday} = require('./utilsdate')

async function getOrders(){
  const query = 'SELECT * from ingramorders'
  const [rows] = await db.query(query)

  return rows
}

async function findOrder(id) {
    const query = `SELECT orderid from orders WHERE orderid = '${id}'`
    const [rows] = await db.query(query)
    // @ts-ignore
    const result = rows.length === 0 ? 'undefined' : rows[0].orderid
 
    return result
}

async function saveNewOrderID(id) {
  const {today} = getToday()
  const query = `INSERT INTO orders VALUES ('${id}', '${today}')`
  await db.query(query)

  return 
}

async function getMercadolibreOrders(today, yesterday){
  const query = `SELECT * FROM ingramorders WHERE date BETWEEN '${yesterday}T13:00:00.000Z' AND '${today}T12:59:00.000Z' AND account = 'APPLE'`
  const [rows] = await db.query(query)

  return rows
}

async function saveIngram (globalorderid, customerPO, trackingNumber, id, name, sku, model, description, price, quantity, account) {
  const {today} = getToday()
  const query = `INSERT INTO ingramorders(nv, id, customerpo, tracking, display, date, name, sku, model, description, price, quantity, account) 
                VALUES ('${globalorderid}', '${id}','${customerPO}','${trackingNumber}', 'false', '${today}', '${name}', '${sku}', '${model}', '${description}', '${price}', '${quantity}', '${account}')`
    
  await db.query(query)
  
  return
}

module.exports = {
  findOrder, 
  saveNewOrderID,
  getMercadolibreOrders,
  saveIngram,
  getOrders
}