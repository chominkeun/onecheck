const service = require('../service/sensor.service')


/* 센서 조회 - floor (floorId) */
exports.getSensorInfo = (req, res, next) => {
  service.getSensorInfo(req, res)
}

exports.getSensorList = (req, res, next) => {
  service.getSensorList(req, res)
}

exports.updateSensor = (req, res, next) => {
  service.updateSensor(req, res)
}

exports.getOneSensor = (req, res, next) => {
  service.getOneSensor(req, res)
}

exports.updateSensorEvent = (req, res, next) => {
  service.updateSensorEvent(req, res)
}

exports.searchSensor = (req, res, next) => {
  service.searchSensor(req, res)
}

exports.searchOutSensor = (req, res, next) => {
  service.searchOutSensor(req, res)
}

exports.createSensorEvent = (req, res, next) => {
  service.createSensorEvent(req, res)
}

exports.createOneSensor = (req, res, next) => {
  service.createOneSensor(req, res)
}

exports.deleteOneSensor = (req, res, next) => {
  service.deleteOneSensor(req, res)
}
/* 지도 영역안의 센서 조회 - NORTHEAST(LAT,LNG) , SOUTHWEST(LAT,LNG) */
exports.getSensorBoundsInfo = (req, res, next) => {
  service.getSensorBoundsInfo(req, res)
}
