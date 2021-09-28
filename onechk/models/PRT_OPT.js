//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const PRT_OPT = sequelize.define(
    'PRT_OPT', {
      PRT_OPT_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      G_NAME: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      O_NAME: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      O_PRICE: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: '0'
      },
      IS_MUTI_CUR: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'N'
      },
      IS_ACTIVE: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'Y'
      },
      STORE_ID: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'STORE_MANAGER',
          key: 'STORE_ID'
        }
      },
      IS_DEFAULT: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'N'
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
      tableName: 'PRT_OPT',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  PRT_OPT.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  // PRT_OPT.prototype.dateFormat = (data) => (
  //     moment(data).format('YYYY-MM-DD')
  // );
  return PRT_OPT
}
