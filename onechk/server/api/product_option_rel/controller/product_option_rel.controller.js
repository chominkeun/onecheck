const service = require('../service/product_option_rel.service')

/* 상품, 옵션 연결 */
exports.RelCreate = (req, res, next) => {
    service.RelCreate(req, res)
}
/* 상품, 옵션 연결해제 */
exports.RelDelete = (req, res, next) => {
    service.RelDelete(req, res)
}
