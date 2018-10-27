const sanaMedicDB = require('../Database/sanaMedicDB')
const moment = require('moment');

exports.getSellerHistoryPerDay = (req, res) => {
  let since = req.query.since;
  let until = req.query.until;
  let userId = req.query.userId;
  let query = `SELECT * FROM coordinates WHERE user_id='${userId}' AND timestamp BETWEEN '${since} 00:00:01' AND '${until} 23:59:59'`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}