const connectionModel = {}

connectionModel.admin = function () {
  return {
    host: 'localhost',
    user: 'root',
    password: 'control123!',
    database: 'siciv'
  }
}

connectionModel.mobile = function () {
  return {
    host: 'localhost',
    user: 'root',
    password: 'control123!',
    database: 'sm_mob'
  }
}

module.exports = connectionModel