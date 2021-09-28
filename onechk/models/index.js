const Sequelize = require('sequelize')
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config() //LOAD CONFIG

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+09:00', //한국 시간 셋팅
    operatorsAliases: Sequelize.Op,
    dialectOptions: {
      connectTimeout: 30000
    },
    pool: {
      max: 500, //pool 최대 접속 수 설정
      min: 0,
      connectionLimit: 1000,
      idle: 10000
    },
    logging: false
  }
)

let db = {}

// models 경로 내 index.js를 제외한 모든 파일을 read하여 테이블 sync처리
fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.js') && file !== 'index.js'
  })
  .forEach(file => {
    console.log(path.join(__dirname, file))
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
