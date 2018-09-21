const sanaMedicDB = require('../Database/sanaMedicDB')

exports.getSellerHistoryPerDay = (req, res) => {
  sanaMedicDB.query('SELECT * FROM coordinates', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}