const { Router } = require('express')
const router = Router()
const controller = require('./controller/sensor_event.controller')

// 센서 속성 전체 조회
router.get('/', controller.getAllEvent)

router.get('/eventoption/:dv_cd/:id', controller.getEventOption)

//센서 속성 삭제
router.delete('/:sensor_event_rel_id', controller.deleteSensorEvent)

router.put('/eventoption/:event_list_id', controller.updateEventList)

router.delete('/eventoption/:event_list_id', controller.deleteEventList)

router.post('/eventoption', controller.createEvent)


module.exports = router
