const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseProgress = sequelize.define('CourseProgress', {
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
  completionPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'course_progress',
  timestamps: false,
});

module.exports = CourseProgress;