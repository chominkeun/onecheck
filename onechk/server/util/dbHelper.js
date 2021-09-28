const mariadb = require('mariadb')
const db = require('../../models')

const pool = mariadb.createPool({
  host: "121.0.123.232",
  port: 3306,
  user: "onecheck",
  password: "1123",
  database: "product_dev",
  connectionLimit: 20
})

function dbHelper() {
  //테스트 용도로 사용
  this.getConnection_Sequalize = function() {
    return db
  }

  this.getConnectionSync = function() {
    db.sequelize.sync()
    return db
  }

  //
  this.getConnectionAsync = async function() {
    try {
      let conn = await pool.getConnection()
      return conn
    } catch (err) {
      throw err
    }
    return null
  }
  //
  this.getConnectionAsync2 = async function() {
    try {
      let conn = await pool.getConnection()
      return conn
    } catch (err) {
      throw err
    }
    return null
  }
  this.sendJSON = function(response, httpCode, body) {
    var result = JSON.stringify(body)
    response.status(httpCode).send(result)
  }
}

module.exports = new dbHelper()
