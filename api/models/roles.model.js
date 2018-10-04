const sanaMedicDB = require('../Database/sanaMedicDB')

exports.getAll = (req, res, next) => {
  let query = `SELECT * FROM roles`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      res.json({status: "success", message: "Roles list found!!!", data: {roles: results}});
    }
  })
}