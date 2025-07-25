const { Sequelize } = require('sequelize');


require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  { host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306
    , dialect: 'mysql',
  }
);
// Test connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Unable to connect to database:', err));

  
module.exports = sequelize;