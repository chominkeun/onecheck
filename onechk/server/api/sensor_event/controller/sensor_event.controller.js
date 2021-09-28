const service = require('../service/sensor_event.service')

exports.getAllEvent = (req, res, next) => {
    service.getAllEvent(req, res)
}

exports.getEventOption = (req, res, next) => {
    service.getEventOption(req, res)
}

exports.deleteSensorEvent = (req, res, next) => {
    service.deleteSensorEvent(req, res)
}

exports.updateEventList = (req, res, next) => {
    service.updateEventList(req, res)
}

exports.deleteEventList = (req, res, next) => {
    service.deleteEventList(req, res)
}

exports.createEvent = (req, res, next) => {
    service.createEvent(req, res)
}

// exports.getFloorSensorEvent = (req, res, next) => {
//     service.getFloorSensorEvent(req, res)
// }