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
  },
  category :{ //to store if the class science or literray 
    type : DataTypes.STRING, 
    allowNull: true
  } ,
   kind :{
    type: DataTypes.STRING ,
    allowNull: true
   },
   status :{
    type:DataTypes.STRING,
    defaultValue: "paid",
    
   }
  

},{
  tableName:'courses',
  timestamps: true

});



module.exports = Course;
