//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
    const BUILDING = sequelize.define(
      'BUILDING',
      {
        BUILDING_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        BUILDING_NAME: {
          type: DataTypes.STRING,
          allowNull: false
        },
        BUILDING_DESC: {
            type: DataTypes.STRING,
            allowNull: true
        },
        BUILDING_ADDRESS: {
          type: DataTypes.STRING,
          allowNull: true
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
        BUILDING_FLOORS: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        BUILDING_BASEMENT_FLOORS: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        BUILDING_LAT: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        BUILDING_LOT: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        USER_NO: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'USER',
              key: 'USER_NO'
            },
            onDelete: 'CASCADE'
        },
        IS_USING_DATA: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Y'
        },
        REG_DATE: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          defaultValue: sequelize.fn('current_timestamp')
        },
        REG_NAME: {
          type: DataTypes.STRING,
          allowNull: true
        },
        CHG_DATE: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('current_timestamp')
        },
        CHG_NAME: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
  
      //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
      {
        freezeTableName: true,
        tableName: 'BUILDING',
        timestamps: false
      }
    )
  
    //removeAttribute 설정 안 할 경우 자동으로 생성 됨
    BUILDING.removeAttribute('id')
  
    //Sequelize에서 함수 추가(필요시 정의)
    // Products.prototype.dateFormat = (data) => (
    //     moment(data).format('YYYY-MM-DD')
    // );
    return BUILDING
  }
  