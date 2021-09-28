const { Router } = require('express')
const router = Router()
const controller = require('./controller/building.controller')

/* 건물 목록 조회 - 전체 (APP에서 사용) */
router.get('/', controller.getAllBuilding)

/* 건물 목록 조회 - (by user_no) */
router.get('/:user_no', controller.getBuildings)

/* 건물 정보 수정 */
router.put('/:building_id', controller.updateBuilding)

/* 건물 삭제 */
router.delete('/:building_id', controller.deleteBuilding)

/* 가게 등록 */
router.post('/:user_no', controller.createBuilding)

router.get('/:building_id', controller.getOneBuilding)

module.exports = router