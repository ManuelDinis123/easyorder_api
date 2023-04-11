var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', //
  password: '', //
  database: 'easyorder',
})
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})
module.exports = connection