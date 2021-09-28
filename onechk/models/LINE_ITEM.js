//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const LINE_ITEM = sequelize.define(
    'LINE_ITEM', {
      LINE_ITEM_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ORDER_QTY: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      //ORDER_OPTS -- JSON 타입 우선 skip
      ORDER_PRICE: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      PRT_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'STORE_PRT',
          key: 'PRT_ID'
        }
      },
      ORDER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'STORE_ORDER',
          key: 'ORDER_ID'
        }
      },
      OPT_NM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      IS_USING_DATA: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Y'
      },
      REG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      REG_NAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CHG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      CHG_NAME: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },

    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
    {
      initialAutoIncrement: 1,
      freezeTableName: true,
      tableName: 'LINE_ITEM',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  LINE_ITEM.removeAttribute('id')

  //orderID에 맞는 상품 목록 조회
  LINE_ITEM.prototype.getListInfos = async (order_id) => {

    /* 1. ORM 프레임워크 방식(FK 설정 필요)(추후 검토 예정) */
    // let line_item_attributes = ["ORDER_PRICE", "ORDER_QTY"]
    // let prt_attibutes = ["PRT_NAME"]
    // let STORE_PRT = sequelize.models.STORE_PRT


    // let include = [{
    //     model : STORE_PRT,
    //     required : true,
    //     attributes : prt_attibutes
    // }]

    // let condition = {where : {ORDER_ID : order_id},
    //                 attributes : line_item_attributes,
    //                 include}

    // let results = await LINE_ITEM.findAll(condition)


    /* 2. 원시 Query 적용*/
    let query = `SELECT B.PRT_NAME,
                            A.OPT_NM,
                            A.ORDER_QTY,
                            A.ORDER_PRICE
                    FROM LINE_ITEM A,
                         STORE_PRT B
                    WHERE 1=1
                      AND A.PRT_ID = B.PRT_ID
                      AND ORDER_ID = :order_id`
    

    let results = await sequelize.query(query,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { order_id: order_id },
        raw: true
      })

    return results
  }

  //Sequelize에서 함수 추가(필요시 정의)
  // Products.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );
  return LINE_ITEM
}
