const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); //  the instance

const User = sequelize.define('User', {
  userName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  verificationCode: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
   isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
   resetToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
//  For 6-digit code-based reset
  resetCode: { type: DataTypes.STRING, allowNull: true },
  resetCodeExpiration: { type: DataTypes.DATE, allowNull: true },

});

module.exports = User;
