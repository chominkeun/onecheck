const service = require('../service/building.service')

/* 건물 목록 조회 - 전체 (APP에서 사용) */
exports.getAllBuilding = (req, res, next) => {
    service.getAllBuilding(req, res)
}

/* 건물 목록 조회 - (by user_no) */
exports.getBuildings = (req, res, next) => {
    service.getBuildings(req, res)
}

/* 건물 정보 수정 */
exports.updateBuilding = (req, res, next) => {
    service.updateBuilding(req, res) 
}

/* 건물 삭제 */
exports.deleteBuilding = (req, res, next) => {
    service.deleteBuilding(req, res)
}

/* 건물 등록 */
exports.createBuilding = (req, res, next) => {
    service.createBuilding(req, res)
}

exports.getOneBuilding = (req, res, next) => {
    service.getOneBuilding(req, res)
}

