const sicivDB = require('../Database/sicivDB')

exports.getClients = (req, res) => {
  sicivDB.query('SELECT * FROM clientes', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}