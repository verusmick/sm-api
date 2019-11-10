const sanaMedicDB = require('../Database/sanaMedicDB');
const logs = require('../logs/logs.service');

exports.getAll = (req, res, next) => {
  let query = `SELECT roles.role_id AS roleId, roles.name, roles.role_code AS codeRole FROM roles`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      logs.write(req.headers.username, req.headers.ci, 'Error en el envio de la lista de Roles.');
      next(err)
    } else {
      logs.write(req.headers.username, req.headers.ci, 'Envio de la lista de Roles completada.');
      res.json({status: "success", message: "Roles list found!!!", data: {roles: results}});
    }
  })
}