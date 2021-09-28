// 매장 좌석 관련 서비스
function T_seat_Service() {
    var dbHelper = require('../../../util/dbHelper')
    // 현재는 sequelize 적용
    // this.get_tseatlist = function(request, response) {
    //     dbHelper.getConnection(function(conn) {
    //         var store_id = request.params.store_id
    //         conn.query('SELECT * FROM T_SEAT WHERE STORE_ID = ?', [store_id])
    //             .then((results) => {
    //                 var output = {};
    //                 output.datas = results;
    //                 dbHelper.sendJSON(response, 200, output);
    //             })
    //             .then((res) => {
    //                 conn.end();
    //             })
    //             .catch(err => {
    //                 //handle error
    //                 console.log(err);
    //                 conn.end();
    //             })
    //     });
    // };

    // sequelize ORM Framework 적용 (매장 내 사용 좌석 전체 조회)
    this.get_tseatlist = function(req, res) {
        db = dbHelper.getConnectionSync()
        var store_id = req.params.store_id

        db.T_SEAT.findAll({
                where: { STORE_ID: store_id }
            })
            .then(result => {
                var output = {}
                output.datas = result
                dbHelper.sendJSON(res, 200, output)
            })
            .catch(err => {
                console.log(err)
            })
    }

    //테이블 좌석명으로 데이터 존재 유무 조회
    // this.exist_tseat = function(request, response){
    //     data = request.params
    //     dbHelper.getConnection(function(conn) {

    //         conn.query('SELECT * FROM T_SEAT WHERE T_SEAT_NO = ? AND STORE_ID = ? AND IS_USING_DATA = ?' , [data.t_seat_no, data.store_id, 'Y'])
    //             .then((results) => {
    //                 var output = {};
    //                 if(results.length > 0){
    //                     data = {exist : true}
    //                 } else {
    //                     data = {exist : false}
    //                 }
    //                 output.datas = data;
    //                 dbHelper.sendJSON(response, 200, output);
    //             })
    //             .then((res) => {
    //                 console.log('res = '+res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    //                 conn.end();
    //             })
    //             .catch(err => {
    //                 //handle error
    //                 console.log(err);
    //                 conn.end();
    //             })
    //     });
    // }

    // sequelize ORM Framework 적용 (매장 내 좌석 존재 유무 조회)
    this.exist_tseat = function(req, res) {
        var data = req.params
        db.T_SEAT.findOne({
                where: { T_SEAT_NO: data.tseat_no, STORE_ID: data.store_id }
            })
            .then(result => {
                var output = {}
                data = { exist: false }
                    // 매장 내 좌석 존재 유무 설정
                if (!(result === null)) {
                    data.exist = true
                }
                output.datas = data
                dbHelper.sendJSON(res, 200, output)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // this.add_tseat = function(request, response) {
    //     //화면단에서 JSON 형식으로 데이터 받음
    //     //data = request.body;

    // //data sample
    // data =
    // [
    //     {
    //     "T_SEAT_NO" : "A024",
    //     "T_COUNT" : 4,
    //     "STORE_ID" : 2,
    //     "LOC_X" : 1,
    //     "LOC_Y" : 4,
    //     "CREATE_ID" : "SYS000",
    //     "CREATE_DT" : new Date(),
    //     "LST_ID" : "SYS000",
    //     "LST_DT" : new Date(),
    //     "IS_USING_DATA" : "Y"
    //     },

    //     {
    //     "T_SEAT_NO" : "A025",
    //     "T_COUNT" : 4,
    //     "STORE_ID" : 2,
    //     "LOC_X" : 1,
    //     "LOC_Y" : 4,
    //     "CREATE_ID" : "SYS000",
    //     "CREATE_DT" : new Date(),
    //     "LST_ID" : "SYS000",
    //     "LST_DT" : new Date(),
    //     "IS_USING_DATA" : "Y"
    //     },

    //     {
    //     "T_SEAT_NO" : "A026",
    //     "T_COUNT" : 4,
    //     "STORE_ID" : 2,
    //     "LOC_X" : 1,
    //     "LOC_Y" : 4,
    //     "CREATE_ID" : "SYS000",
    //     "CREATE_DT" : new Date(),
    //     "LST_ID" : "SYS000",
    //     "LST_DT" : new Date(),
    //     "IS_USING_DATA" : "Y"
    //     }
    // ]

    //     if (data.length === 0){

    //     }
    //     //insert query
    //     var insert_str = 'insert into T_SEAT'

    //     var col_strs = [
    //         "T_SEAT_NO",
    //         "T_COUNT",
    //         "STORE_ID",
    //         "LOC_X",
    //         "LOC_Y",
    //         "CREATE_ID",
    //         "CREATE_DT",
    //         "LST_ID",
    //         "LST_DT",
    //         "IS_USING_DATA"
    //     ]
    //     var col_str = '';

    //     // colunm 정의 string
    //     for(key in col_strs){
    //         col_str += col_strs[key] + ','
    //     }
    //     col_str = col_str.slice(0, -1);

    //     var val_str = '';
    //     var values = [];

    //     // values 정의 String
    //     for(idx in data){
    //         val_str += '(?),'
    //         //values 입력 할 record 값들을 셋팅
    //          values.push([
    //              data[idx].T_SEAT_NO,
    //              data[idx].T_COUNT,
    //              data[idx].STORE_ID,
    //              data[idx].LOC_X,
    //              data[idx].LOC_Y,
    //              data[idx].CREATE_ID,
    //              data[idx].CREATE_DT,
    //              data[idx].LST_ID,
    //              data[idx].LST_DT,
    //              data[idx].IS_USING_DATA
    //          ]);
    //     }
    //     val_str = val_str.slice(0, -1);

    //     insert_str += `(${col_str}) values ${val_str};`

    //     dbHelper.getConnection(function(conn) {
    //          conn.query(insert_str, values)
    //              .then((results) => {
    //                  var output = {};
    //                  output.datas = results;
    //                  console.log(output.datas);
    //                  dbHelper.sendJSON(response, 200, output);
    //             })
    //              .then((res) => {
    //                  console.log('res = '+res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    //                  conn.end();
    //              })
    //              .catch(err => {
    //                  //handle error
    //                  console.log(err);
    //                  conn.end();
    //              })
    //     });
    // }

    // sequelize ORM Framework 적용 (매장 좌석 DB 입력)
    this.add_tseat = function(req, res) {
        db = dbHelper.getConnection_Sequalize()
        //화면단에서 JSON 형식으로 데이터 받음
        data = req.body

            //data sample
            // var data =
            // [
            //     {
            //     "T_SEAT_NO" : "A042",
            //     "T_COUNT" : 4,
            //     "STORE_ID" : 2,
            //     "LOC_X" : 1,
            //     "LOC_Y" : 4,
            //     "CREATE_ID" : "SYS000",
            //     "CREATE_DT" : new Date(),
            //     "LST_ID" : "SYS000",
            //     "LST_DT" : new Date(),
            //     "IS_USING_DATA" : "Y"
            //     },

            //     {
            //     "T_SEAT_NO" : "A043",
            //     "T_COUNT" : 4,
            //     "STORE_ID" : 2,
            //     "LOC_X" : 1,
            //     "LOC_Y" : 4,
            //     "CREATE_ID" : "SYS000",
            //     "CREATE_DT" : new Date(),
            //     "LST_ID" : "SYS000",
            //     "LST_DT" : new Date(),
            //     "IS_USING_DATA" : "Y"
            //     },

            //     {
            //     "T_SEAT_NO" : "A044",
            //     "T_COUNT" : 4,
            //     "STORE_ID" : 2,
            //     "LOC_X" : 1,
            //     "LOC_Y" : 4,
            //     "CREATE_ID" : "SYS000",
            //     "CREATE_DT" : new Date(),
            //     "LST_ID" : "SYS000",
            //     "LST_DT" : new Date(),
            //     "IS_USING_DATA" : "Y"
            //     }
            // ]
            var T_SEAT = db.T_SEAT

            // insert N 건 처리
            T_SEAT.bulkCreate(data, { validate: true })
                .then(insert_data => {
                    var output = {}
                    response_data = {
                        success: true,
                        affectedRows: insert_data.length
                    }
                    output.data = response_data
                    dbHelper.sendJSON(res, 201, output)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    //테이블 좌석 업데이트
    this.update_tseat = async function(req, res) {
        db = dbHelper.getConnectionSync()
        var T_SEAT = db.T_SEAT
        var update_cnt = await T_SEAT.prototype.mutiUpdate(req.body);
        //response 초기값 세팅
        output_data = {};
        status = 202;
        try{
            if(update_cnt >= 0){
                // 정상 처리
                output_data.message = `${update_cnt} row(s) affected Rows matched: ${update_cnt} Changed : ${update_cnt}`
                output_data.count = update_cnt
                output_data.success = true;
            } else {
                // 정상적으로 DB 프로세스는 처리 하였지만 Where 조건으로 인해
                // Row의 상태 변화가 없는 경우
                status = 204;
                output_data.message = `Cannot Update`
                output_data.count = update_cnt
                output_data.success = false;
            }
        }catch(err) {
            // 프로그램 ERROR
            status = 500;
            output_data.message = 'ERROR: Cannot Update T_SEAT'
            output_data.count = 0
            output_data.success = false;
        }

        res.status(status).send(output_data);
    }

    // 테이블 좌석 관리 처리
    //T_SEAT_NO/IS_T_SEAT_USE
    this.update_tseat_use = function(req, res) {
        var tseat_no = req.params.tseat_no
        var is_tseat_use = req.params.is_tseat_use
        var T_SEAT = db.T_SEAT
            //T_SEAT, T_SEAT_USE 업데이트 처리
        T_SEAT.update({
                IS_T_SEAT_USE: is_tseat_use
            }, {
                where: { T_SEAT_NO: tseat_no }
            })
            .then(update_data => {
                var output = {}
                response_data = {
                    success: true,
                    Change: update_data
                }
                output.data = response_data
                dbHelper.sendJSON(res, 200, output)
            })
            .catch(err => {
                console.log(err)
            })
    }

   //-----------------------------------테스트
      //테스트 용도로 사용
      this.get_test = async function(req, res){
        db = dbHelper.getConnection_Sequalize()
        var T_SEAT =  db.T_SEAT
        var resData =  await T_SEAT.prototype.selectOne(req.params);
        try{
            res.send(resData);
        } catch(err){
            res.send(err);
        } finally{}
    }
}

module.exports = new T_seat_Service()
