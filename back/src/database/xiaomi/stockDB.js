require('dotenv').config()
const { isDisturbed } = require('form-data')
const db = require('../db')
const {getToday, getTodayAndYesterday} = require('../utilsdate')

async function getSkus() {
  const query = 'SELECT ingramPartNumber FROM shopifyxiaomi'
  const [rows] = await db.query(query)

  return rows
}

async function getPrices() {
  const query = 'SELECT * FROM shopifyxiaomi'
  const [rows] = await db.query(query)

  return rows
}

async function updatePrevStock() {
  const query = 'UPDATE shopifyxiaomi SET prevStock = stock'
  await db.query(query)
}

async function updateStock(query) {
  await db.query(query)
}

async function getStockToUpdate() {
  const query = 'SELECT inventory_id, stock from shopifyxiaomi WHERE stock != prevStock'
  const [rows] = await db.query(query)

  return rows
}

async function searchSku(sku) {
  const query = `SELECT ingramPartNumber FROM shopifyxiaomi WHERE xiaomiPartNumber = '${sku}'`
  const [rows] = await db.query(query)

  return rows
}



module.exports = {
  getSkus,
  updateStock,
  updatePrevStock,
  getStockToUpdate,
  getPrices,
  searchSku
}