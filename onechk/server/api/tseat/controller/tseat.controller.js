const products = [
    { name: 'Alexandre' },
    { name: 'Pooya' },
    { name: 'Sébastien' }
]

const service = require('../service/tseat.service') 

exports.getTest1 = (req, res, next) => {
    let ssa = { "name" : "test_json" , "kkk" : "aaaa" };
    // console.log(ssa)
}

// 좌석 테이블 매장 내 전체 조회
exports.tseatlist = (req, res, next) => {
    //service.get_tseatlist(req, res);
    service.get_tseatlist(req, res);
}

// 좌석 존재유무 확인
exports.exist_tseat = (req, res, next) => {
    service.exist_tseat(req, res);
}

// 좌석 테이블 입력
exports.add_tseat = (req, res, next) => {
    service.add_tseat(req, res);
}

// 좌석 테이블 정보 수정
exports.update_tseat = (req, res, next) => {
    service.update_tseat(req, res);
}

// 테이블 이용 내역 전체 조회

// 테이블 이용
exports.add_tseat_use = (req, res, next) => {
    service.add_tseat_use(req, res)
}

exports.update_tseat_use = (req, res, next) => {
    service.update_tseat_use(req, res)
}


// 테이블 이용(주문 후 업데이트)
exports.productId = (req, res, next) => {
    const id = parseInt(req.params.id)
        if (id >= 0 && id < products.length) {
        res.json(products[id])
    } else {
        res.sendStatus(404)
    }
}

//-----------------------------------테스트
//좌석 조회(테스트 용도)
exports.get_test = (req, res, next) => {
    service.get_test(req, res);
}


