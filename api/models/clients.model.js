const sicivDB = require('../Database/sicivDB')

exports.getClients = (req, res) => {
  let like = req.query.like;
  let likeQuery = like ? ` WHERE razon_social LIKE '%${like}%'` : '';
  let query = `SELECT * FROM clientes` + likeQuery;
  sicivDB.query(query, function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}