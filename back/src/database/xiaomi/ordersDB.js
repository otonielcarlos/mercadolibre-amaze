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

async function saveCompleteOrderInfo(order) {
  const address = `${order.billing_address.address1}, ${order.billing_address.address2}, ${order.billing_address.city}, ${order.billing_address.province}`
  const productosNombre = order.line_items.map(product => `${product.name}\n`).join(', ')
  const productoSku = order.lines.map(product => `${product.ingramPartNumber}\n`).join(', ')

  let query = `UPDATE shopify_xiaomi_orders SET customerPo = '${order.customerPo}', total_tienda = '${order.total_tienda}', skus = '${productoSku}', 
  productos = '${productosNombre}', nombre = '${order.billing_address.name}', direccion = '${address}', email = '${order.contact_email}', document_number = '${order.document_number}', 
  phone = '${order.phone}', date = '${order.processed_at}' WHERE order_id = '${order.id}';`

  await db.query(query)
}

async function updateIngramOrderNumber(order) {
  let query = `UPDATE shopify_xiaomi_orders SET ingramOrder = '${order.ingramOrder}' WHERE customerPo = '${order.customerPo}'`

  await db.query(query)
}

async function updatefulfillmentBeetrack(order) {
  let query = `UPDATE shopify_xiaomi_orders SET tracking_number = '${order.tracking_number}' WHERE order_id = '${order.ingramOrder}'`
  await db.query(query)
}

async function getShopifyOrderID(ingramOrder) {
  let query =  `SELECT * FROM shopify_xiaomi_orders WHERE ingramOrder = '${ingramOrder}'`
  const [rows] = await db.query(query)

  return rows
}
async function updateLimaTracking(order) {
  let query =  `UPDATE shopify_xiaomi_orders SET tracking_number = '${order.delivery}', fullfilment_id = '${order.fullfilment}' WHERE ingramOrder = '${order.ingramOrder}'`
  const [rows] = await db.query(query)

  return rows
}

async function getDBTracking(customerpo) {
  let query = `SELECT * FROM shopify_xiaomi_orders WHERE customerPo LIKE '%${customerpo}%'`
  const [rows] = await db.query(query)

  return rows[0]
}

module.exports = {
  getDBTracking,
  isOrderInDB,
  saveOrderInDB,
  saveCompleteOrderInfo,
  updateIngramOrderNumber,
  updatefulfillmentBeetrack,
  getShopifyOrderID,
  updateLimaTracking
}