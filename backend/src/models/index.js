const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

// Import models
const User = require('./user.model')(sequelize, Sequelize);
const Watchlist = require('./watchlist.model')(sequelize, Sequelize);
const WatchlistStock = require('./watchlistStock.model')(sequelize, Sequelize);
const Alert = require('./alert.model')(sequelize, Sequelize);

// Define associations
User.hasMany(Watchlist, { foreignKey: 'userId', as: 'watchlists' });
Watchlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Watchlist.hasMany(WatchlistStock, { foreignKey: 'watchlistId', as: 'stocks' });
WatchlistStock.belongsTo(Watchlist, { foreignKey: 'watchlistId', as: 'watchlist' });

User.hasMany(Alert, { foreignKey: 'userId', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  User,
  Watchlist,
  WatchlistStock,
  Alert
};
