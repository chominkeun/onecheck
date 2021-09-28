const service = require('../service/biz.service')

/* 사업자등록번호 api조회결과 */
exports.getBiz = (req, res, next) => {
    service.getBiz(req, res)
}
/*table에 등록할 사업자등록번호가 있는지 확인 */
exports.getDuplicateSearch = (req, res, next) => {
    service.getDuplicateSearch(req, res)
}

exports.createBiz = (req, res, next) => {
    service.createBiz(req, res)
}

// exports.updateBiz = (req, res, next) => {
//     service.updateBiz(req, res)
// }

exports.deleteBiz = (req, res, next) => {
    service.deleteBiz(req, res)
}

exports.getBizByUserNo = (req, res, next) => {
    service.getBizByUserNo(req, res)
}