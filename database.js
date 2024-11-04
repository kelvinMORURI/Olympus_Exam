const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kelvin',
  database: 'eAssessmentDB'
})

function initializeDb(){
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Database connected successfully!");
      });
}

module.exports={initializeDb, connection}
