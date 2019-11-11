const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanaMedicDB = require('../Database/sanaMedicDB');
const logs = require('../logs/logs.service');
var _ = require('lodash');

exports.authenticate = (req, res, next) => {
  // let query = `SELECT * FROM users WHERE ci LIKE  "${req.body.ci}__"`;
  let query = `SELECT * FROM users WHERE ci = '${req.body.ci}'`;
  sanaMedicDB.query(query, (err, results) => {
    if (err) {
      next(err);
    } else if (results.length === 0) {
      logs.write(null, null, 'Usuario con C.I. ' + req.body.ci + ' No tiene accesso.');
      res.json({status: "error", message: "", data: null});
    } else {
      let userInfo = results[0];
      if (bcrypt.compareSync(req.body.password, userInfo.password)) {
        let role = {};
        getRoleById(userInfo.role_id).then(roleResp => {
          role = roleResp;
          return getResourcesPerRole(userInfo.role_id);
        }).then(resources => {
          let token = jwt.sign({id: userInfo.id}, req.app.get('secretKey'), {expiresIn: '8h'});
          let userInfoParsed = {
            firstName: userInfo.first_name,
            secondName: userInfo.second_name,
            firstSurname: userInfo.first_surname,
            secondSurname: userInfo.second_surname,
            cellphone: userInfo.cellphone,
            password: userInfo.password,
            ci: userInfo.ci,
            bornedIn: userInfo.borned_in,
            role: role,
            resources: resources
          };

          logs.write(userInfo.first_name + ' ' + userInfo.first_surname, userInfo.ci, 'Usuario logueado  correctamente.');
          res.json({status: "success", message: "user found!!!", data: {user: userInfoParsed, token: token}});
        })
      } else {
        logs.write(null,null,'Usuario ' + userInfo.first_name + ' ' + userInfo.first_surname+'No tiene accesso.');
        res.json({status: "error", message: "Invalid email/password!!!", data: null});
      }
    }
  })
};

function getRoleById(roleId) {
  return new Promise((resolve, reject) => {
    let roleQuery = `SELECT * FROM roles WHERE role_id = ${roleId}`
    sanaMedicDB.query(roleQuery, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results[0]);
      }
    })
  })
}

function getResourcesPerRole(roleId) {
  return new Promise((resolve, reject) => {
    let resourcesQuery = `SELECT resources.code FROM role_resource 
    INNER JOIN resources ON role_resource.resource_id = resources.resource_id  WHERE role_id = ${roleId}`;
    sanaMedicDB.query(resourcesQuery, (err, results) => {
      if (err) {
        reject(err)
      } else {
        let resourcesPerRole = [];
        _.each(results, (resource) => {
          resourcesPerRole.push(resource.code);
        });
        resolve(resourcesPerRole);
      }
    })
  })
}

exports.getAll = (req, res, next) => {
  let where = req.query.roleFilter ? ` WHERE roles.role_code = "${req.query.roleFilter}"` : '';
  let query = 'SELECT users.first_name AS firstName , ' +
    'users.first_surname AS firstSurname,' +
    'users.second_surname AS secondSurname, ' +
    'users.cellphone,' +
    'users.ci, ' +
    'users.second_name AS secondName, ' +
    'users.borned_in AS bornedIn,  ' +
    'roles.name AS role, ' +
    'roles.role_code AS roleCode ' +
    'FROM users ' +
    'INNER JOIN roles ON users.role_id = roles.role_id' + where;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      logs.write(req.headers.username, req.headers.ci, 'Error en el envio de la lista de Usuarios.');
      next(err)
    } else {
      logs.write(req.headers.username, req.headers.ci, 'Envio de la lista de Usuarios completada.');
      res.json({status: "success", message: "Users list found!!!", data: {users: results}});
    }
  })
};

exports.create = (req, res, next) => {
  let user = req.body;
  let query = `INSERT INTO users(
  first_name,
  second_name,
  first_surname,
  ci,
  borned_in,
  second_surname,
  cellphone,
  role_id,
  password  
  ) 
  VALUES(
  '${user.firstName}',
  '${user.secondName}',
  '${user.firstSurname}',
  '${user.ci}',
  '${user.bornedIn}',  
  '${user.secondSurname}',
  '${user.cellphone}',
  '${user.roleId}',
  '${bcrypt.hashSync(user.password, 10)}')`;
  sanaMedicDB.query(query, (err, results) => {
    if (err) {
      logs.write(req.headers.username, req.headers.ci, 'Error en la creacion de nuevo Usuario.');
      throw next(err);
    }
    logs.write(req.headers.username, req.headers.ci, 'Creacion de nuevo Usuario completada.');
    res.json({status: "success", message: "User added successfully!!!", data: null});
  })
};

exports.getById = (req, res, next) => {
  let query = `SELECT * FROM users WHERE ci = "${req.params.userId}"`
  sanaMedicDB.query(query, function (err, response) {
    if (err) {
      next(err)
    } else if (response.length !== 0) {
      logs.write(req.headers.username, req.headers.ci, 'Envio de Usuario buscado por CI Completado.');
      let user = response[0]
      res.json({
        status: "success",
        message: "User found!!!",
        data: {
          id: user.id,
          firstName: user.first_name,
          secondName: user.second_name,
          firstSurname: user.first_surname,
          secondSurname: user.second_surname,
          cellphone: user.cellphone,
          password: user.password,
          ci: user.ci,
          roleId:user.role_id,
          bornedIn:user.borned_in
        }
      })
    } else {
      logs.write(req.headers.username, req.headers.ci, 'Error en el envio de Usuario buscado por CI Completado.');
      res.json({status: "error", message: "User not found!!!", data: null});
    }
  })
}

exports.updateById = (req, res, next) => {
  let user = req.body;

  let pws = user.password? `, password = '${bcrypt.hashSync(user.password, 10)}'`:'';
  let query = `UPDATE users SET
    first_name = '${user.firstName}',
    second_name = '${user.secondName}',
    first_surname = '${user.firstSurname}',    
    borned_in = '${user.bornedIn}',
    second_surname = '${user.secondSurname}',
    cellphone = '${user.cellphone}',
    role_id= '${user.roleId}'${pws}    
    WHERE users.ci = '${user.ci}'`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      logs.write(req.headers.username, req.headers.ci, `Error en la modificacion del usuario con C.I.: ${user.ci}.`);
      throw err
    }
    logs.write(req.headers.username, req.headers.ci, `Modificacion del usuario con C.I.: ${user.ci}.`);
    res.json({status: "success", message: "User updated successfully!!!", data: null});
  })
}

exports.deleteById = (req, res, next) => {
  let query = `DELETE FROM users WHERE ci = "${req.params.userId}"`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err);
      logs.write(req.headers.username, req.headers.ci, `Error en la eliminacion del usuario con C.I.: ${req.params.userId}.`);
    } else {
      logs.write(req.headers.username, req.headers.ci, `Eliminacion del usuario con C.I.: ${req.params.userId}.`);
      res.json({
        status: "success",
        message: "User deleted successfully!!!",
        data: null
      });
    }
  })
}
