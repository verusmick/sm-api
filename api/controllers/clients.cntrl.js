console.log('Test ... ');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : 'control123!',
  database: 'sana_medic_base'
});


exports.getClients = (req, res) => {
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    connection.query('SELECT * FROM clientes', function(err, results) {
      if (err) throw err
      console.log('test')
      console.log(results.length)
      return res.json(results)
    })
  });
}