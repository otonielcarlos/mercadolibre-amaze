require('dotenv').config()
const db = require('../db')

async function isOrderInDB(order_id){
    let query = `SELECT * FROM shopify_xiaomi_orders WHERE order_id = '${order_id}'`
    const [rows] = await db.query(query)
    return rows
}


async function saveOrderInDB(order_id){
    let query = `INSERT INTO shopify_xiaomi_orders(order_id) VALUES ('${order_id}')`
    const [rows] = await db.query(query)

}

module.exports = {
  isOrderInDB,
  saveOrderInDB
}