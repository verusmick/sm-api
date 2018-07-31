const bcrypt = require ('bcrypt')
const sanaMedicDB = require('../Database/sanaMedicDB')

exports.create = (req, res, next) => {
  let user = req.body;
  let query = `INSERT INTO users(
  first_name,
  first_surname,
  second_surname,
  cellphone,
  password
  ) 
  VALUES(
  '${user.firstName}',
  '${user.firstSurname}',
  '${user.secondSurname}',
  '${user.cellphone}',
  '${bcrypt.hashSync(user.password, 10)}
  ')`;
  sanaMedicDB.query(query, (err, results) => {
    if (err) throw err
    return res.json(results)
  })
};

exports.getUsers = (req, res) => {
  sanaMedicDB.query('SELECT * FROM users', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}