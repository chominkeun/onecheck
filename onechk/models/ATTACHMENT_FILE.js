//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const ATTACHMENT_FILE = sequelize.define(
    'ATTACHMENT_FILE', {
      ATTACHMENT_FILE_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ATTACHMENT_FILE_SIZE: {
        type: DataTypes.INTEGER
      },
      ATTACHMENT_FILE_TYPE: {
        type: DataTypes.STRING
      },
      ATTACHMENT_FILE_NM: {
        type: DataTypes.STRING
      },
      ATTACHMENT_FILE: {
        type: DataTypes.BLOB
      },

      ATTACH_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
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
        defaultValue: sequelize.fn(
          'current_timestamp'
        )
      },
      CHG_NAME: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 ATTACHMENT_FILEs로 호출 됨
    {
      freezeTableName: true,
      tableName: 'ATTACHMENT_FILE',
      timestamps: false
    }
  )

  //removeAttribute 설정 안 할 경우 자동으로 생성 됨
  ATTACHMENT_FILE.removeAttribute('id')

  //Sequelize에서 함수 추가(필요시 정의)
  ATTACHMENT_FILE.prototype.getAttachId = async () => {
    // ATTACH_ID 체번
    let query = 'SELECT NEXTVAL(SQ_ATTACH_ID) AS ID FROM DUAL'
    let res = await sequelize.query(query,
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true
      })

    return res[0].ID
  }

  //Sequelize에서 함수 추가(필요시 정의)
  return ATTACHMENT_FILE
}
