const sicivDB = require('../Database/sicivDB')
const logs = require('../logs/logs.service')

exports.getClients = (req, res) => {
  console.log('Aca === >');
  let like = req.query.like;
  let likeQuery = like ? ` razon_social LIKE '%${like}%'` : '';
  let debt = req.query.debt ? likeQuery ? ` AND deuda_actual ${req.query.debt}` : ` deuda_actual ${req.query.debt}`: '';
  let where = debt || likeQuery ? ' WHERE' : '';
  let query = `SELECT * FROM clientes` + where + likeQuery + debt;
  sicivDB.query(query, function (err, results) {
    if (err){
      logs.write(req.headers.username, req.headers.ci, 'Error en obtencion de lista de Clientes del sistema SICIV.');
      throw err
    }
    logs.write(req.headers.username, req.headers.ci, 'Obtencion de lista de Clientes del sistema SICIV.');
    return res.json(results)
  })
}