const { Router } = require('express')
const router = Router()
const controller = require('./controller/biz.controller')

/* 사업자 등록 api 조회 by bizNum */
router.get('/:biz_num', controller.getBiz)

/* 사업자 기등록 체크 by bizNum*/ 
router.get('/check/:biz_num', controller.getDuplicateSearch)

/* 사업자 등록 */
router.post('/:user_no', controller.createBiz)

/* 사업자등록증 목록 조회 - 전체 (APP에서 사용) */
//router.get('/', controller.getAll)

/* 사업자등록증 목록 조회 (by user_no) */
router.get('/user/:user_no', controller.getBizByUserNo)

/* 사업자등록증 정보 수정 */
// router.put('/:biz_num', controller.updateBiz)

/* 사업자등록증 삭제 */
router.delete('/:biz_num', controller.deleteBiz)

module.exports = router