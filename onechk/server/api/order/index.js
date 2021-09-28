const { Router } = require('express')
const router = Router()
const controller = require('./controller/order.controller')

/* 주문 테이블 - 주문 등록 */
router.post('/createOrder', controller.createOrder)

/* 주문, 목록 테이블 - 주문 조회(STORE_ORDER, LINE_ITEM) */
router.get('/getOrderList/:store_id', controller.getOrderList)

/* 주문 날짜 별 카운트 */
router.get('/getDateCnt/:store_id/:st_date/:et_date', controller.getDateCnt)

module.exports = router