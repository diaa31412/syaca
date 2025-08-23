// const { User, Video, Course, UserProgress, CourseProgress } = require('../models');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const Course = require('../models/courseModel');
const UserProgress = require('../models/userProgressModel');
const CourseProgress = require('../models/courseProgressModel');

exports.saveProgress = async (req, res) => {
  const { userId, courseId, videoId, isCompleted, lastPosition } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(200).json({ message: 'Progress tracking skipped for admin' });
    }
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const [progress, created] = await UserProgress.upsert({
      userId,
      courseId,
      videoId,
      isCompleted,
      lastPosition,
    });
    // Update CourseProgress
    const videos = await Video.findAll({ where: { courseId } });
    const progressRecords = await UserProgress.findAll({ where: { userId, courseId } });
    const completionPercentage = (progressRecords.filter(p => p.isCompleted).length / videos.length) * 100;
    await CourseProgress.upsert({
      userId,
      courseId,
      completionPercentage,
    });
    res.json({ progress, completionPercentage });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: `Failed to save progress: ${error.message}` });
  }
};

exports.getProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const progress = await UserProgress.findAll({
      where: { userId, courseId },
      include: [{ model: Video, attributes: ['id', 'title', 'duration'] }],
    });
    const courseProgress = await CourseProgress.findOne({
      where: { userId, courseId },
      attributes: ['completionPercentage'],
    });
    res.json({
      progress,
      completionPercentage: courseProgress?.completionPercentage || 0,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: `Failed to fetch progress: ${error.message}` });
  }
};