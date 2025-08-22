const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProgress = sequelize.define('UserProgress', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Courses',
      key: 'id',
    },
  },
  videoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Videos',
      key: 'id',
    },
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastPosition: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Last watched position in seconds
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_progress',
  timestamps: false,
});

module.exports = UserProgress;