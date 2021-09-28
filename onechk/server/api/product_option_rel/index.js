const { Router } = require('express')
const router = Router()
const controller = require('./controller/product_option_rel.controller')

/* 상품, 옵션 연결 by data */
router.post('/prtOptRelCreate/:prtId/', controller.RelCreate)

/* 상품 옵션 연결 해제 by data*/ 
router.post('/prtOptRelDelete/:prtId/', controller.RelDelete)

module.exports = router