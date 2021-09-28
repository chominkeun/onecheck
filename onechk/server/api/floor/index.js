const { Router } = require('express')
const router = Router()
const controller = require('./controller/floor.controller')



/* Store id를 통해 실내도 테이블 조회 dv = STORE||BUILDING*/
router.get('/:store_building_id/dv/:dv', controller.getFloorList)

/* 층 이미지 정보 수정 */
router.put('/:floor_id', controller.updateFloor)

module.exports = router