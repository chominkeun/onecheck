module.exports = function(sequelize, DataTypes) {
    const BIZ_LICENSE = sequelize.define(
        'BIZ_LICENSE', {
            BIZ_NUM: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            S_LOCATION: {
                type: DataTypes.STRING
            },
            M_LOCATION: {
                type: DataTypes.STRING
            },
            TRADE_NM: {
                type: DataTypes.STRING
            },
            BIZ_TEL: {
                type: DataTypes.STRING
            },
            ATTACH_ID: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'ATTACHMENT_FILE',
                    key: 'ATTACH_ID'
                }
            },
            USER_NO: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'USER',
                    key: 'USER_NO'
                }
            },
            IS_USING_DATA: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Y'
            },
            REG_NAME: {
                type: DataTypes.STRING,
                allowNull: true
            },
            REG_DATE: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.fn('current_timestamp')
            },
            CHG_NAME: {
                type: DataTypes.STRING,
                allowNull: true
            },
            CHG_DATE: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.fn('current_timestamp')
            }
        },
        //테이블 Name 미 설정 후 쿼리 실행 시 테이블명이 -s로 호출 됨
        {
        freezeTableName: true,
        tableName: 'BIZ_LICENSE',
        timestamps: false
        }
    )
    BIZ_LICENSE.removeAttribute('id')

    return BIZ_LICENSE
}