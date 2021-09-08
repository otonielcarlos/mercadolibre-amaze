const mysql = require('mysql2');
const { resource } = require('../server');

const db = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b5335c6b8fd89c',
  password: '57f435d5',
  database: 'heroku_7e25e9ab702a7da',

});
// const db_last = mysql.createPool({
//   host: '173.231.198.187',
//   user: 'bluediamond_appleperu',
//   password: '.-.bdi-2020.-.',
//   database: 'bluediamond_appleperu',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const findOrder = id => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT orderid from orders WHERE orderid = '${id}'`, (err, results) => {
      if(err) {
        console.log(err);
        return reject(err)
      };
      let result = results.length === 0 ? undefined : results[0].orderid;
      resolve(`${result}`)
    })
  })
}

const saveNewOrderID = (id) => {
  const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5);
  let day = saveDate.toISOString().split('T')[0];
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO orders VALUES ('${id}', '${day}')`, (err, results) => {
      if(err) {
        reject(false);
      }  else {
       resolve(true);
      }
    })
  })
}

const saveIngram = (nv, customerpo) => {
  const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5);
  let day = saveDate.toISOString().split('T')[0];
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO ingramorders VALUES ('${nv}', '${customerpo}','${day}')`, (err, results) => {
      if(err) {
        console.log('err saving ingramorders ', err)
        reject(false);
      }  else {
       resolve(true);
      }
    })
  })
}

module.exports = { findOrder, db, saveNewOrderID, saveIngram };


