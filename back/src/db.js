const mysql = require('mysql2');
// mysql2://bluediamond:4getdBD2018@173.231.198.187/bluediamond_appleperu
const db = mysql.createPool({
  host: '173.231.198.187',
  user: 'bluediamond',
  password: '4getdBD2018',
  database: 'bluediamond_appleperu',
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
