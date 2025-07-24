const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');



const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  className: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacherName: {
    type: DataTypes.STRING,
    allowNull: false
  },
   image: {
    type: DataTypes.STRING, // Stores file path/filename
    allowNull: true // Set to false later if needed
  }

},{
  tableName:'courses',
  timestamps: true

});



module.exports = Course;
