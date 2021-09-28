const { Router } = require('express')
const router = Router()
const controller = require('./controller/prtOpt.controller')

/******* 일괄 처리 - 상품 옵션 *******/
/* 일괄 처리 - 생성, 수정, 삭제 */
router.post('/', controller.applyAll)

/******* 상품 옵션 *******/
/* DB 데이터 조회 - 상품 옵션 : 가게별 조회(by 가게ID) */
router.get('/:store_id', controller.getOpts)
/* DB 데이터 조회 - 상품 옵션 : 상품별 조회(by 상품 ID) */
router.get('/inPrt/:prtId', controller.getPrtOpts)
 /* DB 데이터 카운트 조회 - (by 매장 ID) */
router.get('/getCount/:store_id', controller.getOptCount)

/******* 테스트용 (지워도 됩니당) *******/
// /* 개별 기능(생성, 수정, 삭제) - 테스트 완료 */
// /* 1. 일괄 생성 - 상품 옵션 */
// router.post('/', controller.bulkCreate) 이거 주석 풀면 맨 위의 일괄처리api랑 경로가 같아서 경로 변경해서 사용해야 함

// /* 2. 일괄 수정 - 상품 옵션 */
// router.put('/', controller.bulkUpdate)

// /* 3. 일괄 삭제 - 상품 옵션 */
// router.delete('/', controller.bulkDelete)

module.exports = router