const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseProgress = sequelize.define('CourseProgress', {
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
      completionPercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
}, {
  tableName: 'course_progress',
  timestamps: false,
});

module.exports = CourseProgress;