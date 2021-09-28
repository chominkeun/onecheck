//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const STORE_PRT = sequelize.define(
    'STORE_PRT', {
      PRT_ID: {
        type: DataTypes.INTEGER
      },
      STORE_ID: {
        type: DataTypes.INTEGER
      },
      PRT_NAME: {
        type: DataTypes.STRING
      },
      PRICE: {
        type: DataTypes.INTEGER
      },
      PRT_QTY: {
        type: DataTypes.INTEGER
      },
      B_CODE: {
        type: DataTypes.STRING
      },
      DESC: {
        type: DataTypes.STRING
      },
      IS_ACTIVE: {
        type: DataTypes.STRING
      },
      IS_DISCOUNT: {
        type: DataTypes.STRING
      },
      DISCOUNT: {
        type: DataTypes.FLOAT
      },
      IS_BEST: {
        type: DataTypes.STRING
      },
      CATEGORY_ID: {
        type: DataTypes.STRING
      },
      ATTACH_ID: {
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
      tableName: 'STORE_PRT',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  STORE_PRT.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  // Products.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );
  return STORE_PRT
}
