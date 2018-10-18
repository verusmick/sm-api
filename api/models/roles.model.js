const sanaMedicDB = require('../Database/sanaMedicDB')

exports.getAll = (req, res, next) => {
  let query = `SELECT roles.role_id AS roleId, roles.name, roles.role_code AS codeRole FROM roles`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      res.json({status: "success", message: "Roles list found!!!", data: {roles: results}});
    }
  })
}