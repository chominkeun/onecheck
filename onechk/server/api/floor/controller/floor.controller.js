const service = require('../service/floor.service')

exports.getFloorList = (req, res, next) => {
    service.getFloorList(req, res);
}

exports.updateFloor = (req, res, next) => {
    service.updateFloor(req, res) 
}