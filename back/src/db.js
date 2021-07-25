const mysql = require('mysql2');
const { resource } = require('../server');

//DATABASE URL mysql2://bluediamond:4getdBD2018@173.231.198.187/bluediamond_appleperu?reconnect=true

const db = mysql.createConnection({
  connectionLimit: 10,
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b5335c6b8fd89c',
  password: '57f435d5',
  database: 'heroku_7e25e9ab702a7da',

});
const db_last = mysql.createPool({
  host: '173.231.198.187',
  user: 'bluediamond_appleperu',
  password: '.-.bdi-2020.-.',
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

const saveNewOrderID = (id) => {
  return new Promise((resolve, reject) => {
    
    const saveDate = new Date()
    let day = saveDate.toISOString().split('T')[0];

    db.query(`INSERT INTO orders VALUES ('${id}', '${day}')`, (err, results) => {
      if(err) {
        console.log(`Id ${id} no insertado`,err);
        reject(false);
      }  else {
       console.log(`Id ${id} insertado el ${day}`);
       resolve(true);
      }
    })
    db.end();
  })
  
}

module.exports = { findOrder, db, saveNewOrderID };
