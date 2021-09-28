const service = require('../service/prtOpt.service')

/******* 일괄 처리 - 상품 옵션 *******/
/* 일괄 처리 - 생성, 수정, 삭제 */
exports.applyAll = (req, res) => {
  service.applyAll(req, res)
}

/******* 상품 옵션 CRUD *******/
/* DB 데이터 조회 - 상품 옵션 : 가게별 조회(by 가게ID) */
exports.getOpts = (req, res) => {
  service.getOpts(req, res)
}

/* DB 데이터 조회 - 상품 옵션(상품별) : 상품별 조회(by 상품ID) */
exports.getPrtOpts = (req, res) => {
  service.getPrtOpts(req, res)
}

  /* DB 데이터 카운트 조회 - (by 매장 ID) */
exports.getOptCount = (req, res) => {
  service.getOptCount(req, res)
}

/******* 테스트용 (지워도 됩니당) *******/
// /* 개별 기능(생성, 수정, 삭제) - 테스트 완료 */
// /* 1. 일괄 생성 - 상품 옵션 */
// exports.bulkCreate = (req, res) => {
//     service.bulkCreate(req, res)
// }

// /* 2. 일괄 수정 - 상품 옵션 */
// exports.bulkUpdate = (req, res) => {
//     service.bulkUpdate(req, res)
// }

// /* 3. 일괄 삭제 - 상품 옵션 */
// exports.bulkDelete = (req, res) => {
//     service.bulkDelete(req, res)
// }
