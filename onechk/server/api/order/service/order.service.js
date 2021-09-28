function orderService() {
    const dbHelper = require('../../../util/dbHelper')
    const db = dbHelper.getConnectionSync()


    /* 상품 카테고리 테이블 - 상점ID로 전체 조회 */
    this.getCategory = function(req, res) {
        const store_id = req.params.store_id
        db.PRT_CATEGORY.findAll({
                where: { STORE_ID: store_id }
            })
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                res.status(500).send({
                    message: `ERROR : 상품 카테고리 조회 중 오류 발생 STORE_ID : ${store_id}`
                })
            })
    }

    /* 주문 날짜 별 카운트 */
    this.getDateCnt = async function(req, res) {
        const store_id = req.params.store_id
        const st_date = req.params.st_date
        const et_date = req.params.et_date
        const STORE_ORDER = db.STORE_ORDER
        let orderCnt_res = await STORE_ORDER.prototype.orderDateList(store_id, st_date, et_date);
        let status = 0;
        let outdatas = {};
        
        try{
            let orderCnt = orderCnt_res[0].orderCnt
            status = 200;
            outdatas.orderCnt = orderCnt;
            outdatas.isSuccess = true;
            outdatas.resMsg = 'SUCCESS Query Ok Count Order'
        }catch(error) {
            console.log(error.message)
            status = 500;
            outdatas.isSuccess = false;
            outdatas.resMsg = 'ERROR : Cannot Process Search In Count Order'
        }

        res.status(status).send(outdatas);
        // promise_cnt.then(result => {
        //     let cnt = result[0].dataValues.orderCnt;
        //     status = 200;
        //     outdatas.orderCnt = cnt;
        //     outdatas.isSuccess = true;
        //     outdatas.resMsg = 'SUCCESS Query Ok Count Order'
        //     res.status(status).send(outdatas);
        // })
        // .catch(error => {
        //     status = 500;
        //     outdatas.isSuccess = false;
        //     outdatas.resMsg = 'ERROR : Cannot Process Search In Count Order'
        //     res.status(status).send(outdatas);
        // })
        
    }

    /* 주문, 목록 테이블 - 주문 조회(STORE_ORDER, LINE_ITEM) */
    this.getOrderList = function(req, res) {
        
        const STORE_ORDER = db.STORE_ORDER
        const LINE_ITEM = db.LINE_ITEM
        const store_id = req.params.store_id
        const condition = {where : {STORE_ID : store_id}}
        let status = 0;
        let outdatas = {};
        //주문 내역
        STORE_ORDER.findAll(condition)
        .then( async (orderDatas) => {

            for(idx in orderDatas){
                let order_id = orderDatas[idx].ORDER_ID
                //주문 내역 내 상품 정보
                items = await LINE_ITEM.prototype.getListInfos(order_id)
                orderDatas[idx].dataValues.items = items
            }
            status = 200
            outdatas.isSuccess = true;
            outdatas.resMsg = 'SUCCESS Query Ok: STORE_ORDER, LINE_ITEM'
            outdatas.datas = orderDatas

            //console.log(datas);
            res.status(status).send(outdatas);
        })
        .catch(err => {
            status = 500
            outdatas.isSuccess = false;
            outdatas.resMsg = 'ERROR : Cannot Process Search In STORE_ORDER, LINE_ITEM'
            res.status(status).send(outdatas);
        })
    }

    this.createOrder = function(req, res) {
        let store_order = db.STORE_ORDER
        let line_item = db.LINE_ITEM
        //주문 번호 채번
        let make_order_num = db.STORE_ORDER.prototype.make_order_num();
      
        make_order_num.then( async (order_num) => {

            let outdatas = {};
            let status = 0;
            let store_order_data = req.body.store_order
            let line_item_data = req.body.line_item
            //order_num 채번 된 주문번호
            store_order_data.ORDER_NUM = order_num

            
            let send_res = (pstatus, isSuccess, resMsg) => {
                //response에 필요한 응답 코드 및 성공여부, 메세지
                status = pstatus
                outdatas.isSuccess = isSuccess
                outdatas.resMsg = resMsg
                outdatas.orderNum = order_num
                res.status(status).send(outdatas);
            }

            // 비관리형 트랜잭션 실행(STORE_ORDER, LINE_ITEM)
            const t = await db.sequelize.transaction();
            try{
                //store_order 데이터 삽입
                const order = await store_order.create(store_order_data, {transaction : t});
                const order_id = order.ORDER_ID

                //store_order 정상 입력여부 체크
                if(order_id === null){
                    send_res(404, false, `Fail Insert STORE_ORDER`)
                    return
                }
                
                //line_item 데이터 입력 전 처리
                for (let idx in line_item_data) {
                        console.log(line_item_data[idx]);
                        line_item_data[idx].ORDER_ID = order_id
                }

                //line_item 데이터 삽입
                let create_line_items = await line_item.bulkCreate(line_item_data, {transaction : t})

                //line_item 정상 입력여부 체크
                if(create_line_items === null){
                    send_res(404, false, `Fail Insert STORE_ORDER`)
                    await t.rollback();
                    return
                }

                // 트랜잭션 작업이 정상 처리 된 경우
                send_res(200, true, 'SUCCESS : STORE_ORDER, LINE_ITEM')
                await t.commit();
                
            }catch(error) {
                send_res(500, false, 'ERROR : Cannot Process Transection')
                await t.rollback();
            }
        })
    }

}
    module.exports = new orderService()    