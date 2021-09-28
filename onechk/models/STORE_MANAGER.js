//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const STORE_MANAGER = sequelize.define(
    'STORE_MANAGER',
    {
      STORE_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      STORE_CODE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      STORE_NAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      STORE_FORM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ZIP_CODE: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ADDRESS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      EXTRA_ADDRESS: {
        type: DataTypes.STRING,
        allowNull: true
      },
      STORE_TEL_NUM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      STORE_FAX_NUM: {
        type: DataTypes.STRING,
        allowNull: true
      },
      STORE_LAT: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      STORE_LOT: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      DESC: {
        type: DataTypes.STRING,
        allowNull: true
      },
      OPEN_DAY: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: sequelize.fn('current_timestamp')
      },
      IS_ACTIVE: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N'
      },
      IS_SEAT_MNG: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N'
      },
      USER_NO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'USER',
          key: 'USER_NO'
        },
        onDelete: 'SET NULL'
      },
      STORE_CATEGOTY_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'STORE_CATEGORY',
          key: 'STORE_CATEGORY_ID'
        }
      },
      STORE_BANK_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'STORE_BANK_INFO',
          key: 'STORE_BANK_ID'
        }
      },
      ATTACH_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ATTACHMENT_FILE',
          key: 'ATTACH_ID'
        },
        onDelete: 'SET NULL'
      },
      STORE_FLOORS: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      STORE_BASEMENT_FLOORS: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      REG_NAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      REG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      CHG_NAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
      CHG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      }
    },

    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
    {
      freezeTableName: true,
      tableName: 'STORE_MANAGER',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  STORE_MANAGER.removeAttribute('id')


  //Sequelize에서 함수 추가(필요시 정의)
  // Products.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );
  return STORE_MANAGER
}
