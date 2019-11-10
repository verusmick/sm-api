const sicivDB = require('../Database/sicivDB');
const logs = require('../logs/logs.service');
exports.getEmployers = (req, res) => {
  sicivDB.query('SELECT * FROM us_funcionarios', function (err, results) {
    if (err){
      logs.write(req.headers.username, req.headers.ci, 'Error en obtencion de Empreados del sistema SICIV.');
      throw err
    }
    logs.write(req.headers.username, req.headers.ci, 'Obtencion de Empreados del sistema SICIV.');
    return res.json(results)
  })
}