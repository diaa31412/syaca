const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  deviceFingerprint: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(512),
    allowNull: false
  }
});




module.exports = Session;