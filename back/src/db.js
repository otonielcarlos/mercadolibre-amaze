const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b5335c6b8fd89c',
  password: '57f435d5',
  database: 'heroku_7e25e9ab702a7da',
});

const findOrder = id => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT orderid from orders WHERE orderid = '${id}'`, (err, results) =>{
      if(err) reject(err);
      let result = results.length === 0 ? undefined : results[0].orderid;
      resolve(result)
    })
    db.end();
  })
}

module.exports = { db, findOrder };
