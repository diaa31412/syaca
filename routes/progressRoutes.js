const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/', progressController.saveProgress);
router.get('/:userId/:courseId', progressController.getProgress);

module.exports = router;