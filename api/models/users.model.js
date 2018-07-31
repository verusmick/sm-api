const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sanaMedicDB = require('../Database/sanaMedicDB')

exports.create = (req, res, next) => {
  let user = req.body;
  let query = `INSERT INTO users(
  first_name,
  first_surname,
  ci,
  second_surname,
  cellphone,
  password
  ) 
  VALUES(
  '${user.firstName}',
  '${user.firstSurname}',
  '${user.ci}',
  '${user.secondSurname}',
  '${user.cellphone}',
  '${bcrypt.hashSync(user.password, 10)}')`;
  sanaMedicDB.query(query, (err, results) => {
    if (err) throw next(err);
    res.json({status: "success", message: "User added successfully!!!", data: null});
  })
};

exports.authenticate = (req, res) => {
  let query = `SELECT * FROM users WHERE ci LIKE  "${req.body.ci}__"`;
  sanaMedicDB.query(query, (err, results) => {
    if (err) {
      next(err);
    } else if (results.length === 0) {
      res.json({status: "error", message: "", data: null});
    } else {
      let  userInfo = results[0]
      if (bcrypt.compareSync(req.body.password, userInfo.password)) {
        let token = jwt.sign({id: userInfo.id}, req.app.get('secretKey'), {expiresIn: '1h'});
        res.json({status: "success", message: "user found!!!", data: {user: userInfo, token: token}});
      } else {
        res.json({status: "error", message: "Invalid email/password!!!", data: null});
      }
    }
  })
}

exports.getUsers = (req, res) => {
  sanaMedicDB.query('SELECT * FROM users', function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}