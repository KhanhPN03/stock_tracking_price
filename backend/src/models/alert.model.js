module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define(
    'Alert',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false
      },
      targetPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      condition: {
        type: DataTypes.ENUM('above', 'below'),
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      triggered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      triggeredAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      notificationSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: true,
      tableName: 'alerts'
    }
  );

  return Alert;
};
