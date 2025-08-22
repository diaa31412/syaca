
const User = require('./userModel');
const Course = require('./courseModel');
const Subscriber = require('./subscriberModel');
const Video = require('./videoModel');
const Card = require('./cardModel'); 
const UserProgress = require('./userProgressModel');
const CourseProgress = require('./courseProgressModel');
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

UserProgress.belongsTo(User,
   { foreignKey: 'userId', 
    as: 'user' 
});

UserProgress.belongsTo(Course, 
  { foreignKey: 'courseId',
     as: 'course' 
});

UserProgress.belongsTo(Video, 
  { foreignKey: 'videoId',
   as: 'video' 
});

User.hasMany(UserProgress,
   { foreignKey: 'userId', 
  as: 'progress' 
});

Course.hasMany(UserProgress, 
  { foreignKey: 'courseId',
     as: 'progress'
 });

Video.hasMany(UserProgress, 
  { foreignKey:'videoId',
     as: 'progress' 
});

CourseProgress.belongsTo(User, 
  { foreignKey: 'userId', 
as: 'user' });


CourseProgress.belongsTo(Course,
   { foreignKey: 'courseId', 
as: 'course'
});

User.hasMany(CourseProgress,
   { foreignKey: 'userId', 
  as: 'courseProgress'
 });
 
Course.hasMany(CourseProgress, 
  { foreignKey: 'courseId', 
    as: 'courseProgress' 
});

module.exports = {
  sequelize,
  User,
  Course,
  Subscriber,
  Video,
  Card
};