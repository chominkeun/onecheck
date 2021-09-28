//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const T_SEAT = sequelize.define('T_SEAT',
    {
      T_SEAT_NO: {
        type: DataTypes.STRING
      },
      T_COUNT: {
        type: DataTypes.INTEGER
      },
      IS_T_SEAT_USE: {
        type: DataTypes.STRING
      },
      STORE_ID: {
        type: DataTypes.INTEGER
      },
      LOC_X: {
        type: DataTypes.INTEGER
      },
      LOC_Y: {
        type: DataTypes.INTEGER
      },
      IS_USING_DATA: {
        type: DataTypes.STRING
      },
      REG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      REG_NAME: {
        type: DataTypes.STRING
      },
      CHG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      CHG_NAME: {
        type: DataTypes.STRING
      }
    },

    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 T_SEATs로 호출 됨
    {
      freezeTableName: true,
      tableName: 'T_SEAT',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  T_SEAT.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  // Products.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );


  //Sequelize에서 함수 추가(필요시 정의)
  T_SEAT.prototype.selectOne = async function(params) {
    //params
    //USING {store_id : 2, tseat_no, 'A008'}
    var a_rec = await T_SEAT.findOne({
      where: {
        STORE_ID: params.store_id,
        T_SEAT_NO: params.tseat_no
      }
    })
    var datas = null
    try {
      datas = a_rec
    } catch (err) {
      datas = err
    }
    return await datas
  }

  //muti updated
  T_SEAT.prototype.mutiUpdate = async function(body) {
    body_data = body
    var update_cnt = 0
    //객체 속성
    /*
        1. 다중 update하기 위해 이중 for문 처리 필요
        2. DB에서 기존에 처리했던 테이블 번호 OLD값 또는 식별하는 ID값 필요
           (우선 OLD_T_SEAT_NO를 넣어 처리함)
    */
    for (idx in body) {
      var update_tg_obj = {}
      for (data in body[idx]) {
        if (data !== 'OLD_T_SEAT_NO' && data !== 'T_SEAT_ID') {
          update_tg_obj[data] = body[idx][data]
        }
      }
      update_data = await T_SEAT.update(update_tg_obj,
        {
          where: { T_SEAT_NO: body[idx].OLD_T_SEAT_NO }
        })
      if (update_data !== 0) {
        update_cnt += 1
      }
    }
    return update_cnt
  }

  T_SEAT.prototype.selectAll = function() {

  }

  return T_SEAT
}
