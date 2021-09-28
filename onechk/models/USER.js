//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const USER = sequelize.define(
    'USER', {
      USER_NO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      USER_ID: {
        type: DataTypes.STRING
      },
      PAWD: {
        type: DataTypes.STRING
      },
      NAME: {
        type: DataTypes.STRING
      },
      E_MAIL: {
        type: DataTypes.STRING
      },
      PHONE_NUM: {
        type: DataTypes.STRING
      },
      IS_AUTH: {
        type: DataTypes.STRING
      },
      USER_CLCD: {
        type: DataTypes.STRING
      },
      ONE_POINT: {
        type: DataTypes.INTEGER
      },
      IS_BIZ: {
        type: DataTypes.STRING
      },
      IS_BLOCK: {
        type: DataTypes.STRING
      },
      SOCIAL: {
        type: DataTypes.STRING
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
      },


    },
    //Model Option
    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 USERs로 호출 됨
    {
      freezeTableName: true,
      tableName: 'USER',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  USER.removeAttribute('id')

  USER.prototype.getKakaoId = async () => {
    let query = 'SELECT NEXTVAL(sq_social_id) AS ID FROM DUAL'
    let res = await sequelize.query(query,
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true
      })

    return res[0].ID
  }
  return USER
}
