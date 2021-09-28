const { Router } = require('express')
const router = Router()
const controller = require('./controller/sensor.controller')


/* 센서 조회 - floor (floorId) */
router.get('/:floorId', controller.getSensorInfo)

// 센서 조회 - SensorEvent (SensorEventId)
router.get('/',controller.getSensorList)

// 센서 개별 조회(이벤트 )
router.get('/OneSensor/:sensor_id', controller.getOneSensor)

//검색
router.get('/search/:search_param/limit/:limit',controller.searchSensor)

//실외도 검색
router.get('/outSearch/:search_param/limit/:limit',controller.searchOutSensor)

/* 센서 정보 수정 */
router.put('/:sensor_id', controller.updateSensor)

//센서 개별 이벤트 수정
router.put('/OneSensor/:sensor_id', controller.updateSensorEvent)

//센서 개별 속성 추가
router.post('/:sensor_id', controller.createSensorEvent)

//새로운 센서 생성
router.post('/', controller.createOneSensor)

//1개 센서 삭제
router.delete('/:sensor_id', controller.deleteOneSensor)

/* 지도 영역안의 센서 조회 - NORTHEAST(LAT,LNG) , SOUTHWEST(LAT,LNG) */
router.get('/map/bounds/:ne_lat/:ne_lng/:sw_lat/:sw_lng', controller.getSensorBoundsInfo)


module.exports = router
