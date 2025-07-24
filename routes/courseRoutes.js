const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { uploadImage } = require('../middleware/multer');


router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', authMiddleware, roleMiddleware('admin'),uploadImage.single('image'), courseController.createCourse);
router.put('/:id', authMiddleware, roleMiddleware('admin'), uploadImage.single('image'),courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), courseController.deleteCourse);


module.exports = router;