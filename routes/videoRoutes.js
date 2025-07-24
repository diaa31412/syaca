const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const {uploadVideo} = require('../middleware/multer');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Upload video (admin only)
router.post(
  '/course/:courseId/upload',
  auth,
  role('admin'),
  uploadVideo.single('video'),
  videoController.uploadVideo
);

// Get all videos for a course
router.get('/course/:courseId', auth, videoController.getVideosByCourse);

module.exports = router;
