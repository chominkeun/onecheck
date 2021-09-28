const service = require('../service/table.service')

/* TABLE 등록 */
exports.createTable = (req, res, next) => {
    service.createTable(req, res)
}
/* TABLE 정보 수정 */
exports.updateTable = (req, res, next) => {
    service.updateTable(req, res)
}
/* TABLE 삭제 */
exports.deleteTable = (req, res, next) => {
    service.deleteTable(req, res)
}
/* TABLE 목록 조회 */
exports.getTables = (req, res, next) => {
    service.getTables(req, res)
}
