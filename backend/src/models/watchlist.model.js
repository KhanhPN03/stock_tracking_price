module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define(
    'Watchlist',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      timestamps: true,
      tableName: 'watchlists'
    }
  );

  return Watchlist;
};
