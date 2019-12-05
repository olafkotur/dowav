var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "pi",
  password: "pythones",
  database: "dbe",
  port:3306
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  for(var i = 0; i < 72; i++)
  {
    var sql = "CREATE TABLE " + i.toString() + "hour (time VARCHAR(255), temp int, humid int, light int, location int)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  }
}); 