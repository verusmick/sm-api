const sicivDB = require('../Database/sicivDB')

exports.getEmployers = (req, res) => {
  sicivDB.query('SELECT * FROM us_funcionarios', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}