//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const T_SEAT_USE = sequelize.define('T_SEAT_USE',
    {
      T_SEAT_USE_DT: {
        type: DataTypes.DATE
      },
      T_SEAT_USE_EXIT_DT: {
        type: DataTypes.DATE
      },
      ORDER_ID: {
        type: DataTypes.INTEGER
      },
      T_SEAT_ID: {
        type: DataTypes.INTEGER
      },
      IS_USING_DATA: {
        type: DataTypes.STRING,
        defaultValue: 'Y'
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

    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명 뒤에 s로 호출 됨
    {
      freezeTableName: true,
      tableName: 'T_SEAT_USE',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  T_SEAT_USE.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  // Products.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );


  return T_SEAT_USE
}
