const mysql = require('mysql2/promise')
require('dotenv').config()
const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env

const db = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  multipleStatements: true, 
})

module.exports = db