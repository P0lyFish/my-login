con = require('../database/db')


function insertNewUser(user) {
  con.query("USE user", (err, result) => {
    if (err)
      throw err;
  });

  console.log(user.username);

  query = `INSERT INTO user(username, password) VALUES("${user.username}", "${user.password}")`;
  console.log(query);
  con.query(query, (err, result) => {
    if (err)
      throw err;
    console.log("Inserted a new user");
  });
}


function getUser(username, givenPassword, callback) {
  con.query("USE user", (err, result) => {
    if (err)
      throw err;
    console.log("Using user table");
  });

  var loggedUser = null;
  con.query(`SELECT * FROM user WHERE user.username = "${username}"`, (err, result) => {
    if (err)
      throw err;

    if (result[0].password === givenPassword) {
      callback(result[0]);
    }
    else {
      callback(null);
    }
  });

  return loggedUser;
}


module.exports = {
  insertNewUser: insertNewUser,
  getUser: getUser
};
