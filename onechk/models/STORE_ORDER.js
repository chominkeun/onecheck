const { data } = require('jquery')
const moment = require('moment')
moment().format('YYYY-MM-DD')

//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const Op = sequelize.Sequelize.Op
  const STORE_ORDER = sequelize.define(
    'STORE_ORDER', {
      ORDER_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ORDER_NUM: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      ORDER_STATE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      IS_PAYMENT_COMP: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N'
      },
      IS_ONLINE_ORDER: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N'
      },
      IS_CANCEL_ORDER: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N'
      },
      ORDER_TIME: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn
        ('current_timestamp')
      },
      CUST_NM: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'POS'
      },
      USER_NO: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'USER',
          key: 'USER_NO'
        } 
      },
      SHARD_ORDER_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'STORE_ORDER',
          key: 'ORDER_ID'
        }
      },
      STORE_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'STORE_MANAGER',
          key: 'STORE_ID'
        }
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
      },
    },

    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
    {
      initialAutoIncrement: 1,
      freezeTableName: true,
      tableName: 'STORE_ORDER',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  STORE_ORDER.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  STORE_ORDER.prototype.make_order_num = async () => {
    // 오더 번호 체번
    let query = `SELECT cast(IFNULL(MAX(ORDER_NUM), DATE_FORMAT(NOW(),'%y%m%d0000')) as SIGNED INTEGER) + 1 as make_order_num FROM STORE_ORDER WHERE DATE(REG_DATE) = curdate();`
    let res = await sequelize.query(query,
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true
      })

    return JSON.stringify(res[0].make_order_num)
  }

  STORE_ORDER.prototype.orderDateList = async (store_id, st_date, et_date) => {
    //ORDER_TIME: { [Op.between]: [moment(st_date).format('YYYY-MM-DD'), moment(et_date).format('YYYY-MM-DD')]
    let condition = {
      raw: true,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('ORDER_ID')), 'orderCnt']
      ],
      where: {
        STORE_ID: store_id,
        [Op.and]: [
          sequelize.where(sequelize.fn('DATE', sequelize.col('ORDER_TIME')),
            {
              [Op.between]: [st_date, et_date]
            }
          )
        ]
      }
    }
    let result = await STORE_ORDER.findAll(condition)
    return result
  }

  //YYYY-MM-DD 관리 함수 추가
  STORE_ORDER.prototype.dateFormat = (date) => (
    moment(date).format('YYYY-MM-DD')
  )

  return STORE_ORDER
}

