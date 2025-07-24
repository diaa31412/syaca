const Video = require('../models/videoModel');

exports.uploadVideo = async (req, res) => {
  console.log('📥 Received upload request');
  console.log('File:', req.file);
  console.log('Body:', req.body);
  try {
    const { title ,duration } = req.body;
    const courseId = req.params.courseId;
    console.log('title:', title);
    console.log('courseId:',courseId)
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    const videoUrl = `/uploads/videos/${req.file.filename}`;

    // If duration is not provided, set it to 0
    const videoDuration = duration ? parseInt(duration, 10) : 0;

    const video = await Video.create({ title, videoUrl, courseId ,duration: videoDuration});
    console.log('We have create video ');
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVideosByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const videos = await Video.findAll({ where: { courseId } });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
