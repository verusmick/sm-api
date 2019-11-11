var fs = require("fs");

exports.write = function (user, ci, msg) {
  var log = {
    user: user,
    ci: ci,
    msg: msg,
    time: Date.now()
  };
  fs.appendFile("logs.txt", '\n' + JSON.stringify(log) + ',', function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

exports.read = function () {
  console.log('tete');
  return new Promise((resolve, reject) => {
    fs.readFile("logs.txt", function (err, content) {
      resolve( content.toString())
    });
  })
}