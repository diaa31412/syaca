const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProgress = sequelize.define('UserProgress', {
  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastPosition: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
}, {
  tableName: 'user_progress',
  timestamps: false,
});

module.exports = UserProgress;