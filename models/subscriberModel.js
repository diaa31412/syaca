const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subscriber = sequelize.define('Subscriber', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'subscribers',
  timestamps: true
});


module.exports = Subscriber;
