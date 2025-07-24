// const User = require('./userModel');
// const Course = require('./courseModel');
// const Subscriber = require('./subscriberModel');
// const Video = require('./videoModel');
// const sequelize = require('../config/db');

// // Define associations
// User.belongsToMany(Course, {
//   through: Subscriber,
//   foreignKey: 'userId',
//   as: 'subscribedCourses',
// });
// Course.belongsToMany(User, {
//   through: Subscriber,
//   foreignKey: 'courseId',
//   as: 'subscribers',
// });

// Subscriber.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Subscriber.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Course.hasMany(Video, { foreignKey: 'courseId', as: 'videos' });
// Video.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// module.exports = {
//   sequelize,
//   User,
//   Course,
//   Subscriber,
//   Video
// };



const User = require('./userModel');
const Course = require('./courseModel');
const Subscriber = require('./subscriberModel');
const Video = require('./videoModel');
const Card = require('./cardModel'); // Make sure to include Card model
const Session = require('./sessionModel');
const sequelize = require('../config/db');



// User-Course many-to-many through Subscriber
User.belongsToMany(Course, {
  through: Subscriber,
  foreignKey: 'userId',
  otherKey: 'courseId',
  as: 'subscribedCourses',
  onDelete: 'CASCADE' // Optional: cascade delete
});

Course.belongsToMany(User, {
  through: Subscriber,
  foreignKey: 'courseId',
  otherKey: 'userId',
  as: 'subscribers',
  onDelete: 'CASCADE' // Optional: cascade delete
});

// Subscriber belongs to both User and Course
Subscriber.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

Subscriber.belongsTo(Course, { 
  foreignKey: 'courseId',
  as: 'course' 
});

// Add association to Card if subscriptions use cards
Subscriber.belongsTo(Card, {
  foreignKey: 'cardId',
  as: 'card'
});

// Course-Video one-to-many
Course.hasMany(Video, { 
  foreignKey: 'courseId',
  as: 'videos',
  onDelete: 'CASCADE' // Typically videos are deleted when course is deleted
});

Video.belongsTo(Course, { 
  foreignKey: 'courseId',
  as: 'course'
});


// seesion model 
Session.associate = models => {
  Session.belongsTo(models.User, { foreignKey: 'userId' });
};


// If cards belong to users
User.hasMany(Card, {
  foreignKey: 'userId',
  as: 'cards'
});

Card.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Course,
  Subscriber,
  Video,
  Card
};