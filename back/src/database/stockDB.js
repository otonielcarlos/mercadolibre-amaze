const db = require('../database/db')




async function updatePrevStock () {
  let query = 'UPDATE appleml set prevstock = stock'
  const [rows] = await db.query(query)

  return 'updated'
}

async function updateStock (query) {
  const [rows] = await db.query(query)
  // @ts-ignore
  return `actualizado ${rows.length} ingramPartNumbers`

}


async function getAllSkus() {
  let query = 'SELECT sku from appleml WHERE sku is NOT NULL AND sku != ""'
    const [rows] = await db.query(query) 
    let returnedArray = []
        // @ts-ignore
    rows.forEach(product => {
      returnedArray.push(product.sku)
    })

    let filteredArray = returnedArray.filter((c, index) => {
      return returnedArray.indexOf(c) === index
  })

    return filteredArray
}

async function updateTracking (trackingNumber, id, shippingAddress) {
  let query = `UPDATE ingramorders SET tracking = '${trackingNumber}', display = 'true', address = '${shippingAddress}' WHERE id = ${id}`
  const [rows] = await db.query(query)

  return rows
}



async function getAllVariations() {
  let query = 'SELECT * FROM appleml WHERE itemid IS NOT NULL AND variationid IS NOT NULL AND stock != prevstock'
  const [rows] = await db.query(query)

  return rows
}


async function getAllNoVariations() {
  let query = 'SELECT * FROM appleml WHERE itemid IS NOT NULL AND variationid IS NULL AND stock != prevstock'
  
  const [rows] = await db.query(query)

  // @ts-ignore
  let resolvedArray = rows.map(result => {
  return {itemid: result.itemid, data: {'available_quantity': result.stock}}
  })

  return resolvedArray

}

async function getProducts() {
  const query = 'SELECT * FROM appleml'
  const [rows] = await db.query(query)

  return rows
}

module.exports = {
  updatePrevStock,
  updateStock,
  getAllSkus,
  updateTracking,
  getAllVariations,
  getAllNoVariations,
  getProducts
}