// @ts-nocheck

const db = require('../database/db')

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

function getNullTickets(account){
  return new Promise((resolve, reject) => {
    let query = `SELECT * from ingramorders WHERE tracking = 'null' AND account = '${account}'`
    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

const getTickets = () => {
  return new Promise((resolve, reject) => {
    let query =
      "SELECT nv as 'nota_de_venta', id as 'id_mercadolibre', customerpo, tracking as 'guia_rastreo', date as 'fecha' from ingramorders WHERE display = 'true' ORDER BY date DESC"
    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

const updateTracking = (trackingNumber, id, shippingAddress) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ingramorders SET tracking = '${trackingNumber}', display = 'true', address = '${shippingAddress}' WHERE id = ${id}`
    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

const setCancel = id => {
  let query = `UPDATE ingramorders SET tracking = 'cancelled' WHERE id = ${id}`
  db.query(query, (err, results) => {
    if (err) log(err)
    log(results)
  })
}

const setDisplay = id => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ingramorders SET display = "false" WHERE customerpo = '${id}'`
    db.query(query, (err, results) => {
      if(err) console.log(err)
    if(results.affectedRows === 1) {
      resolve(1)
    } else {
      resolve(0)
    }
    })
  })
}

const showAll = () => {
  return new Promise((resolve, reject) => {
    let query = "SELECT nv as 'nota_de_venta', id as 'id_mercadolibre', customerpo, tracking as 'guia_rastreo', date as 'fecha' from ingramorders WHERE tracking IS NOT NULL and tracking != 'cancelled' ORDER BY date DESC"
    db.query(query, (err, results) => {
      if(err) console.log(err)
      resolve(results)
    })
  })
}

const getAllSkus = () => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT sku from appleml WHERE sku is NOT NULL AND sku != ""'
    db.query(query, (err, results) => {
      if(err) console.log(err)
      let returnedArray = []
      results.forEach(product => {
        returnedArray.push(product.sku)
      })
      let filteredArray = returnedArray.filter((c, index) => {
        return returnedArray.indexOf(c) === index
    })
      resolve(filteredArray)
    })
  })  
}

const updatePrevStock = () => {
  return new Promise ((resolve, reject) => {
  let query = 'UPDATE appleml set prevstock = stock'
  db.query(query, (err, results) => {
    if(err) console.log(err)

    resolve ('status: update prev stock')
  })
})
}

const updateStock = query => {
  return new Promise((resolve,reject) =>{
    db.query(query, (err, results) => {
      if(err) console.log(err)

      resolve(true)
    })
  })
}

const getAllVariations = () => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM appleml WHERE itemid IS NOT NULL AND variationid IS NOT NULL AND stock != prevstock'
    db.query(query, (err, results) => {
      if(err) console.log(err)

      resolve(results)
    })
  })
}
const getAllNoVariations = () => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM appleml WHERE itemid IS NOT NULL AND variationid IS NULL AND stock != prevstock'
    let resolvedArray = []
    db.query(query, (err, results) => {
      if(err) console.log(err)

    results.forEach(result => {
    resolvedArray.push({itemid: result.itemid, data: {'available_quantity': result.stock}})
})
      resolve(resolvedArray)
    })
  })
}

async function saveIngram (globalorderid, customerPO, trackingNumber, id, name, sku, model, description, price, quantity, account) {
  const {today} = getToday()
  const query = `INSERT INTO ingramorders(nv, id, customerpo, tracking, display, date, name, sku, model, description, price, quantity, account) 
                VALUES ('${globalorderid}', '${id}','${customerPO}','${trackingNumber}', 'false', '${today}', '${name}', '${sku}', '${model}', '${description}', '${price}', '${quantity}', '${account}')`
    
    await db.query(query)
  
    return
}

function getMercadolibreOrders(today, yesterday){
  const orders = new Promise((resolve, reject) => {
    const query = `SELECT * FROM ingramorders WHERE date BETWEEN '${yesterday}T13:00:00.000Z' AND '${today}T12:59:00.000Z' AND account = 'APPLE'`
    db.query(query, (err, results) => {
      if(err) console.log(err)

      resolve(results)
    })
  })
  return orders
}



module.exports = {
  db,
  findOrder,
  saveNewOrderID,
  saveIngram,
  getNullTickets,
  updateTracking,
  setCancel,
  getTickets,
  setDisplay,
  showAll,
  getAllSkus,
  updateStock,
  updatePrevStock,
  getAllVariations,
  getAllNoVariations,
  getMercadolibreOrders
}
