const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'control123!',
  database: 'siciv'
})

module.exports = connection