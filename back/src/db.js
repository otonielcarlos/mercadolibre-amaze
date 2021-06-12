const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b5335c6b8fd89c',
  password: '57f435d5',
  database: 'heroku_7e25e9ab702a7da',
});


module.exports = { db };
