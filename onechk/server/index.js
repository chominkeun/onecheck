const express = require('express')
const db = require('../models')

class App {
  constructor() {
    // Create express instance
    this.app = express()

    // db 접속
    this.dbConnection()

    // 미들웨어 셋팅
    this.setMiddleWare()

    // 라우팅(필요시 추가 예정)
    this.getRouting()

    // 로컬 변수(필요시 추가 예정)
    this.setLocals()
  }

  dbConnection() {
    // DB authentication
    db.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
      })
      .then(() => {
        console.log('DB Sync complete.')
        //return db.sequelize.sync();
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err)
      })
  }

  setMiddleWare() {
    // 미들웨어 셋팅 필요시 활용
  }

  setLocals() {
    // 템플릿 변수
    // this.app.use( (req, res, next) => {
    //     this.app.locals.isLogin = true;
    //     this.app.locals.req_path = req.path;
    //     next();
    // });
  }

  getRouting() {
    // Require API routes
    const routes = require('./api')
    // Import API Routes
    this.app.use('/', routes)
  }
};

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// const cors = require('cors')
// app.use(cors());


const app = new App().app

// Start standalone server if directly running
// if (require.main === module) {
//   const port = process.env.PORT || 3000
//   app.listen(port, () => {
//     // eslint-disable-next-line no-console
//     console.log(`API server listening on port ${port}`)
//   })
// }

// Export express app
module.exports = app
