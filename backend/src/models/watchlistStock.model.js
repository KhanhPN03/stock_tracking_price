module.exports = (sequelize, DataTypes) => {
  const WatchlistStock = sequelize.define(
    'WatchlistStock',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      watchlistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'watchlists',
          key: 'id'
        }
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false
      },
      addedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      timestamps: true,
      tableName: 'watchlist_stocks',
      indexes: [
        {
          unique: true,
          fields: ['watchlistId', 'symbol']
        }
      ]
    }
  );

  return WatchlistStock;
};
