const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b5335c6b8fd89c',
  password: '57f435d5',
  database: 'heroku_7e25e9ab702a7da',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const findOrder = id => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT orderid from orders WHERE orderid = '${id}'`, (err, results) => {
      if(err) {
        console.log(err);
        return reject(err)
      };
      let result = results.length === 0 ? undefined : results[0].orderid;
      resolve(result)
    })
    db.end();
  })
}

const closeDB = () => {
  return new Promise((resolve, reject) => {
    resolve(db.end)
  })
}

module.exports = { findOrder, db, closeDB };
