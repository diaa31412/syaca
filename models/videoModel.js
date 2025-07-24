const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// adjust if your path is different

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,  // Default to 0 if not provided
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
});


module.exports = Video;
