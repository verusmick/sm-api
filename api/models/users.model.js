const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sanaMedicDB = require('../Database/sanaMedicDB')

exports.authenticate = (req, res, next) => {
  let query = `SELECT * FROM users WHERE ci LIKE  "${req.body.ci}__"`;
  sanaMedicDB.query(query, (err, results) => {
    if (err) {
      next(err);
    } else if (results.length === 0) {
      res.json({status: "error", message: "", data: null});
    } else {
      let userInfo = results[0]
      if (bcrypt.compareSync(req.body.password, userInfo.password)) {
        let token = jwt.sign({id: userInfo.id}, req.app.get('secretKey'), {expiresIn: '12h'});
        res.json({status: "success", message: "user found!!!", data: {user: userInfo, token: token}});
      } else {
        res.json({status: "error", message: "Invalid email/password!!!", data: null});
      }
    }
  })
}

exports.getAll = (req, res, next) => {
  sanaMedicDB.query('SELECT * FROM users', function (err, results) {
    let usersList = []
    if (err) {
      next(err)
    } else {
      for (let user of results) {
        usersList.push({
          id: user.id,
          firstName: user.first_name,
          firstSurname: user.first_surname,
          secondSurname: user.second_surname,
          cellphone: user.cellphone,
          password: user.password,
          ci: user.ci
        });
      }
      res.json({status: "success", message: "Users list found!!!", data: {movies: usersList}});
    }
  })
}

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

exports.getById = (req, res, next) => {
  let query = `SELECT * FROM users WHERE id = ${req.params.userId}`
  sanaMedicDB.query(query, function (err, response) {
    if (err) {
      next(err)
    } else if (response.length !== 0) {
      let user = response[0]
      res.json({
        status: "success",
        message: "User found!!!",
        data: {
          id: user.id,
          firstName: user.first_name,
          firstSurname: user.first_surname,
          secondSurname: user.second_surname,
          cellphone: user.cellphone,
          password: user.password,
          ci: user.ci
        }
      })
    }else{
      res.json({status: "error", message: "User not found!!!", data: null});
    }
  })
}

//todo: implement later
exports.updateById = (req, res, next) => {
  let query = `SELECT * FROM users WHERE ci LIKE  "${req.body.ci}__"`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}

exports.deleteById = (req, res, next) => {
  let query = `DELETE FROM users WHERE id = ${req.params.userId}`;
  sanaMedicDB.query(query, function (err, results) {
    if(err)
      next(err);
    else {
      res.json({
        status: "success",
        message: "User deleted successfully!!!",
        data: null});
    }
  })
}
