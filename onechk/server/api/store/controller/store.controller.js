const service = require('../service/store.service')

/* 가게 목록 조회 - 전체 (APP 사용) */
exports.getAll = (req, res, next) => {
  service.getAll(req, res)
}

/* 가게 목록 조회 (by user_id) */
exports.getStores = (req, res, next) => {
  service.getStores(req, res)
}

/* 가게 조회 - 1개 (by user_id, store_id) */
exports.getStore = (req, res, next) => {
  service.getStore(req, res)
}

/* 가게 조회 - 1개 (by store_id) */
exports.getOneStore = (req, res, next) => {
  service.getOneStore(req, res)
}

/* 가게 등록 */
exports.createStoreInfo = (req, res, next) => {
  service.createStoreInfo(req, res)
}

/* 가게 정보 수정 */
exports.updateStoreInfo = (req, res, next) => {
  service.updateStoreInfo(req, res)
}

/* 가게 삭제 */
exports.deleteStoreInfo = (req, res, next) => {
  service.deleteStoreInfo(req, res)
}

/* 가게 카테고리 조회 */
exports.getStoreCategory = (req, res, next) => {
  service.getStoreCategory(req, res)
}
