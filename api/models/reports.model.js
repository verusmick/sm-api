const sanaMedicDB = require('../Database/sanaMedicDB')

exports.getStatusGpsPerSeller = (req, res, next) => {
  let since = req.query.since;
  let until = req.query.until;
  let userId = req.query.userId;
  let query = `SELECT
   track_detail.track_detail_id,
   track_detail.user_id,
   track_detail.timestamp,
   status_track.name AS 'status'
   FROM
   track_detail
   INNER JOIN
   status_track ON track_detail.status_track_id = status_track.status_track_id
   WHERE
   user_id = '${userId}' 
   AND TIMESTAMP BETWEEN '${since} 00:00:01' AND '${until} 23:59:59' ORDER BY track_detail.timestamp ASC`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      res.json({status: "success", message: "Report list found!!!", data: results});
    }
  })
}