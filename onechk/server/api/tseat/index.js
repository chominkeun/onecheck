const { Router } = require('express');
const { route } = require('../user');
const router = Router()
const controller = require('./controller/tseat.controller');


/* GET t_seat listing. */
// 좌석 전체 조회 리스트
router.get('/tseatliat/:store_id', controller.tseatlist);

// 좌석명의 존재 유무 조회
router.get('/exist-tseat/:tseat_no/:store_id', controller.exist_tseat);

/* GET t_seat listing. */
//router.get('/t_seatlist/:t_seat_id', controller.usersId);

/* POST 좌석 입력*/
//router.post('/add_tseat', controller.add_tseat);
router.get('/add-tseat', controller.add_tseat);

/* PUT 좌석정보 수정. */
router.put('/update-tseat', controller.update_tseat);

/* 테이블 이용 내역 전체조회. */
router.get('/tseat-use/:store_id', controller.add_tseat_use);

/* POST 테이블 이용내역 관리 */
router.put('/update-tseat_use/tseat-no/:tseat_no/is-tseat-use/:is_tseat_use', controller.update_tseat_use);

// 좌석 조회 테스트
router.get('/get-test/store-id/:store_id/tseat-no/:tseat_no', controller.get_test)

    //console.log(req.body);
    //res.json(req.body);

module.exports = router;