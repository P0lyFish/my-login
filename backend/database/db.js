var mysql = require('mysql')


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hng@0402"
});

con.connect(err => {
  if (err)
    throw err;

  con.query("CREATE DATABASE IF NOT EXISTS miniLib", (err, result) => {
    if (err)
      throw err;
    console.log("Create database successful!");
  });
});


con.query("USE user", (err, result) => {
  if (err)
    throw err;
});

var query = "CREATE TABLE IF NOT EXISTS user (userId INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255))"
con.query(query, (err, result) => {
  if (err)
    throw err;
});


module.exports = con;
