//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
    const PRODUCT_OPTION_REL = sequelize.define(
      'PRODUCT_OPTION_REL', {
        PRT_ID: {
          type: DataTypes.INTEGER(11),
          allowNull: true,
          references: {
            model: 'STORE_PRT',
            key: 'PRT_ID'
         }
        },
        PRT_OPT_ID: {
          type: DataTypes.INTEGER(11),
          allowNull: true,
          references: {
            model: 'PRT_OPT',
            key: 'PRT_OPT_ID'
         }
        },
      },
  
      //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
      {
        freezeTableName: true,
        tableName: 'PRODUCT_OPTION_REL',
        timestamps: false
      }
    )
  
    //removeAttribute 설정 안 할 경우 자동으로 생성 됨
    PRODUCT_OPTION_REL.removeAttribute('id')
  
    //Sequelize에서 함수 추가(필요시 정의)
    return PRODUCT_OPTION_REL
  }
  