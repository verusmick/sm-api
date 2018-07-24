const mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'control123!',
  database: 'siciv'
})

module.exports = connection