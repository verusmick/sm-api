const sanaMedicDB = require('../Database/sanaMedicDB')
const sicivDB = require('../Database/sicivDB')

exports.getUsers= (req, res) => {
  sicivDB.query('SELECT * FROM us_usuarios', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}