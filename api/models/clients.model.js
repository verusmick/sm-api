const sicivDB = require('../Database/sicivDB')
const logs = require('../logs/logs.service')

exports.getClients = (req, res) => {
  let like = req.query.like;
  let likeQuery = like ? ` WHERE razon_social LIKE '%${like}%'` : '';
  let query = `SELECT * FROM clientes` + likeQuery;
  sicivDB.query(query, function (err, results) {
    if (err){
      logs.write(req.headers.username, req.headers.ci, 'Error en obtencion de lista de Clientes del sistema SICIV.');
      throw err
    }
    logs.write(req.headers.username, req.headers.ci, 'Obtencion de lista de Clientes del sistema SICIV.');
    return res.json(results)
  })
}