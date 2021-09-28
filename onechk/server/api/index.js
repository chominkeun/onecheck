const express = require('express')
const app = express()
const logger = require('morgan');

// GET / 200 2.173 ms - 13
// GET /favicon.ico 404 1.906 ms - 150
// GET /admin/products 200 8.938 ms - 967
app.use(logger('dev'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//cors정책을 피하기 위한 모듈
const cors = require('cors')
app.use(cors())

const user = require('./user/index')
const store = require('./store/index')
const product = require('./product/index')
const pcategory = require('./pcategory/index')
const prtopt = require('./prtopt/index')
const tseat = require('./tseat/index')
const order = require('./order/index')
const attach = require('./attach/index')
const building = require('./building/index')
const biz = require('./biz/index')
const floor = require('./floor/index')
const sensor = require('./sensor/index')
const sensor_event = require('./sensor_event/index')
const kakao_login = require('./kakao_login/index')
const product_option_rel = require('./product_option_rel/index')

app.use('/user', user)
app.use('/store', store)
app.use('/product', product)
app.use('/pcategory', pcategory)
app.use('/prtopt', prtopt)
app.use('/tseat', tseat)
app.use('/order', order)
app.use('/attach', attach) 
app.use('/building', building)
app.use('/biz', biz)
app.use('/floor',floor)
app.use('/sensor',sensor)
app.use('/sensor_event',sensor_event)
app.use('/kakao_login',kakao_login)
app.use('/productOptionRel', product_option_rel)

module.exports = app
