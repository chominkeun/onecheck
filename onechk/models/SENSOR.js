//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const SENSOR = sequelize.define(
    'SENSOR', {
      SENSOR_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      SENSOR_NAME: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      SENSOR_DESC: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      FLOOR_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'FLOOR_INFO_ATTACH_REL',
          key: 'FLOOR_ID'
        }
      },
      BOUND: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: 1
      },
      SENSOR_LOC_X: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      SENSOR_LOC_Y: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      SENSOR_DV: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      IS_ACTIVATE: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'Y'
      },
      IS_USING_DATA: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'Y'
      },
      REG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      REG_NAME: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      CHG_DATE: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('current_timestamp')
      },
      CHG_NAME: {
        type: DataTypes.STRING(20),
        allowNull: true
      }
    },

    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
    {
      freezeTableName: true,
      tableName: 'SENSOR',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  SENSOR.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  // PRT_OPT.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );
  return SENSOR
}
