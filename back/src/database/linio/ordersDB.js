
require('dotenv').config()
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')

async function getLinioOrders(yesterday, today){
  const query = `SELECT * FROM ingramorders_liniope WHERE date BETWEEN '${yesterday}' AND '${today}'`
  const [rows] = await db.query(query)

  return rows
}



async function updateFacturaStatus(order_id) {
const query = `UPDATE ingramorders_liniope SET disabled = 'true' WHERE order_id = '${order_id}'`

const [rows] = await db.query(query)
console.log(rows)
}

async function saveOrder ({OrderId, name, address, nv, CustomerEmail, requiereFactura, NationalRegistrationNumber, ItemsCount, Price, date, customerPO, itemsSku, itemsNames}) {
	const query = `INSERT INTO ingramorders_liniope VALUES('${OrderId}','${customerPO}','${nv}', '${Price}','${itemsSku}','${ItemsCount}', '${itemsNames}', '${name}', '${CustomerEmail}', '${address}', '${date}', '${requiereFactura}', '${NationalRegistrationNumber}','false')`;
	await db.query(query)
};

async function getOrdersFromLinioInDatabase() {
  const query = 'SELECT * FROM ingramorders_liniope'
  const [ rows ] = await db.query(query)

  return rows
}
async function updateFacturaStatus(order_id) {
  const query = `UPDATE ingramorders_liniope SET disabled = 'true' WHERE order_id = '${order_id}'`
  const [ rows ] = await db.query(query)

}


module.exports = {
  getLinioOrders,
  updateFacturaStatus,
  saveOrder,
  getOrdersFromLinioInDatabase
}