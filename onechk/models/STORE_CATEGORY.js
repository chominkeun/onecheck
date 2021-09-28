//Sequelize를 통한 테이블 생성
module.exports = function(sequelize, DataTypes) {
  const STORE_CATEGORY = sequelize.define(
    'STORE_CATEGORY',
    {
      STORE_CATEGORY_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      STORE_KND: {
        type: DataTypes.STRING,
        allowNull: false
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
    {
      freezeTableName: true,
      tableName: 'STORE_CATEGORY',
      timestamps: false
    }
  )
  STORE_CATEGORY.removeAttribute('id')
  return STORE_CATEGORY
}
