// @ts-nocheck
const mysql = require('mysql2')
const { resolveHostname } = require('nodemailer/lib/shared')
require('dotenv').config()
const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env
// const { resource } = require('../server')
const log = console.log

const db = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  multipleStatements: true, 
})

const findOrder = id => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT orderid from orders WHERE orderid = '${id}'`,
      (err, results) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        let result = results.length === 0 ? 'undefined' : results[0].orderid
        resolve(`${result}`)
      }
    )
  })
}

const saveNewOrderID = id => {
  const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5)
  let day = saveDate.toISOString().split('T')[0]
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO orders VALUES ('${id}', '${day}')`,
      (err, results) => {
        if (err) {
          reject(false)
        } else {
          resolve(true)
        }
      }
    )
  })
}

const saveIngram = (nv, customerpo, trackingNumber, id) => {
  const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5)
  let day = saveDate.toISOString().split('T')[0]
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO ingramorders VALUES ('${nv}', '${id}','${customerpo}','${trackingNumber}', 'false','${day}')`,
      (err, results) => {
        if (err) {
          console.log('err saving ingramorders ', err)
          reject(false)
        } else {
          resolve(true)
        }
      }
    )
  })
}

const getNullTickets = () => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * from ingramorders WHERE tracking = 'null'"
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

const updateTracking = (trackingNumber, id) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ingramorders SET tracking = '${trackingNumber}', display = 'true' WHERE id = ${id}`
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
}
