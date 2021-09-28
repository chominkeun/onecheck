const service = require('../service/order.service')

/* 주문 테이블 - 주문 내역 등록 */
exports.createOrder = (req, res) => {
    service.createOrder(req, res);
}

/* 주문, 목록 테이블 - 주문 조회(STORE_ORDER, LINE_ITEM) */
exports.getOrderList = (req, res) => {
    service.getOrderList(req, res);
}

/* 주문 날짜 별 카운트 */
exports.getDateCnt = (req, res) => {
    service.getDateCnt(req, res);

}