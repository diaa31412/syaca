const { UserProgress, CourseProgress, Video, Course, Sequelize } = require('../models');

exports.saveProgress = async (req, res) => {
  const { userId, courseId, videoId, isCompleted, lastPosition } = req.body;

  try {
    // Verify user is subscribed to the course
    const subscription = await Subscriber.findOne({ where: { userId, courseId } });
    if (!subscription) {
      return res.status(403).json({ error: 'User not subscribed to course' });
    }

    // Verify session (for single-device login)
    const session = await Session.findOne({ where: { userId, token: req.headers.authorization?.split(' ')[1] } });
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Save or update progress
    await UserProgress.upsert({
      userId,
      courseId,
      videoId,
      isCompleted,
      lastPosition,
      lastUpdated: new Date(),
    });

    // Calculate course completion percentage
    const totalVideos = await Video.count({ where: { courseId } });
    const completedVideos = await UserProgress.count({
      where: { userId, courseId, isCompleted: true },
    });
    const completionPercentage = (completedVideos / totalVideos) * 100;

    // Update course progress
    await CourseProgress.upsert({
      userId,
      courseId,
      completionPercentage,
      lastUpdated: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
};

exports.getProgress = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Verify session
    const session = await Session.findOne({ where: { userId, token: req.headers.authorization?.split(' ')[1] } });
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Get video progress
    const videos = await Video.findAll({
      where: { courseId },
      include: [{
        model: UserProgress,
        as: 'progress',
        where: { userId },
        required: false,
      }],
      attributes: ['id', 'title', 'videoUrl', 'duration', [Sequelize.col('progress.isCompleted'), 'isCompleted'], [Sequelize.col('progress.lastPosition'), 'lastPosition']],
    });

    // Get course completion
    const courseProgress = await CourseProgress.findOne({ where: { userId, courseId } });

    res.json({
      videos: videos.map(v => ({
        videoId: v.id,
        title: v.title,
        videoUrl: v.videoUrl,
        duration: v.duration,
        isCompleted: v.progress?.isCompleted || false,
        lastPosition: v.progress?.lastPosition || 0,
      })),
      completionPercentage: courseProgress?.completionPercentage || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};