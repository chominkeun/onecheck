//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
    const FLOOR_INFO_ATTACH_REL = sequelize.define(
      'FLOOR_INFO_ATTACH_REL',
      {
        FLOOR_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        FLOOR_DV_CD: {
            type: DataTypes.STRING,
            allowNull: false
        },
        BUILDING_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'BUILDING',
                key: 'BUILDING_ID'
            }
        },
        STORE_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'STORE_MANAGER',
                key: 'STORE_ID'
            }
        },
        IS_GROUND: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Y'
        },
        FLOOR_NO: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        REG_ID: {
          type: DataTypes.STRING,
          allowNull: true
        },
        CHG_DATE: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('current_timestamp')
        },
        CHG_ID: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
  
      //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
      {
        freezeTableName: true,
        tableName: 'FLOOR_INFO_ATTACH_REL',
        timestamps: false
      }
    )
  
    //removeAttribute 설정 안 할 경우 자동으로 생성 됨
    FLOOR_INFO_ATTACH_REL.removeAttribute('id')
  
    //Sequelize에서 함수 추가(필요시 정의)
    // Products.prototype.dateFormat = (data) => (
    //     moment(data).format('YYYY-MM-DD')
    // );
    return FLOOR_INFO_ATTACH_REL
  }
  