const { Router } = require('express')
const router = Router()
const controller = require('./controller/table.controller')

/* TABLE 등록 */
router.post('/:store_id', controller.createTable)
/* TABLE 정보 수정 */
router.put('/:t_seat_id', controller.updateTable)
/* TABLE 삭제 */
router.delete('/:t_seat_id', controller.deleteTable)
/* TABLE 목록 조회 */
router.get('/:store_id', controller.getTables)

module.exports = router