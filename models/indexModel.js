const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Import models
const User = require('./userModel');
const Course = require('./courseModel');
const Subscriber = require('./subscriberModel');
const Video = require('./videoModel');
const Card = require('./cardModel');
const UserProgress = require('./userProgressModel');
const CourseProgress = require('./courseProgressModel');
const Session = require('./sessionModel');

// User-Course many-to-many through Subscriber
User.belongsToMany(Course, {
  through: Subscriber,
  foreignKey: 'userId',
  otherKey: 'courseId',
  as: 'subscribedCourses',
  onDelete: 'CASCADE',
});
Course.belongsToMany(User, {
  through: Subscriber,
  foreignKey: 'courseId',
  otherKey: 'userId',
  as: 'subscribers',
  onDelete: 'CASCADE',
});

// Subscriber associations
Subscriber.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Subscriber.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Subscriber.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });

// Course-Video one-to-many
Course.hasMany(Video, { foreignKey: 'courseId', as: 'videos', onDelete: 'CASCADE' });
Video.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Session association
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Card associations
User.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// UserProgress associations
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserProgress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
UserProgress.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
User.hasMany(UserProgress, { foreignKey: 'userId', as: 'progress' });
Course.hasMany(UserProgress, { foreignKey: 'courseId', as: 'progress' });
Video.hasMany(UserProgress, { foreignKey: 'videoId', as: 'progress' });

// CourseProgress associations
CourseProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CourseProgress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
User.hasMany(CourseProgress, { foreignKey: 'userId', as: 'courseProgress' });
Course.hasMany(CourseProgress, { foreignKey: 'courseId', as: 'courseProgress' });

module.exports = {
  sequelize,
  User,
  Course,
  Subscriber,
  Video,
  Card,
  UserProgress,
  CourseProgress,
  Session,
};