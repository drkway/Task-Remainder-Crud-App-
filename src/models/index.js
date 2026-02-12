const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Task = require('./task')(sequelize, Sequelize.DataTypes);
db.OTP = require('./otp')(sequelize, Sequelize.DataTypes);
db.RefreshToken = require('./refreshToken')(sequelize, Sequelize.DataTypes);
db.ActivityLog = require('./activityLog')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Task.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.RefreshToken, { foreignKey: 'userId' });
db.User.hasMany(db.OTP, { foreignKey: 'userId' });
db.User.hasMany(db.ActivityLog, { foreignKey: 'userId' });

module.exports = db;
