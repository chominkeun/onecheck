//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const SENSOR_EVENT = sequelize.define(
    'SENSOR_EVENT', {
      SENSOR_EVENT_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      SENSOR_EVENT_NAME: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      SENSOR_EVENT_DESC: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      IS_ACTIVATE: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: 'Y'
      },
      IS_USING_DATA: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: 'Y'
      },
      REG_DATE: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn('current_timestamp')
      },
      REG_NAME: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      CHG_DATE: {
        type: DataTypes.DATE,
        allowNull: true,
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
      tableName: 'SENSOR_EVENT',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  SENSOR_EVENT.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  // PRT_OPT.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );
  return SENSOR_EVENT
}
