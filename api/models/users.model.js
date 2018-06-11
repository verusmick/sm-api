const mysql = require('mysql')
const connection = require('./connection')

const adm_conn = mysql.createConnection(connection.admin());

exports.getUsers= (req, res) => {
  adm_conn.query('SELECT * FROM us_usuarios', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}