const Course = require('../models/courseModel');


// GET all courses
exports.getAllCourses = async (req, res) => {
    try {
      const courses = await Course.findAll({
      order: [['createdAt', 'DESC']] // Sort by createdAt descending
    });
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve courses' });
    }
  };

  
// GET course by ID
exports.getCourseById = async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve course' });
    }
  };

  

  // CREATE course (Admin only)
exports.createCourse = async (req, res) => {
    try {
      const { courseName, className, teacherName , description} = req.body;

        // Handle image upload
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename; // Get uploaded filename
    }
      const course = await Course.create({ courseName,  className, teacherName ,description,image: imagePath ,category,
      kind
});
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create course' + err});
    }
  };


  // UPDATE course (Admin only)
exports.updateCourse = async (req, res) => {
    try {
      const { courseName, className: className, teacherName,description  ,category,
      kind
} = req.body;
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });


      // Save old image name before update
    const oldImage = course.image;
  
      course.courseName = courseName;
      course.className = className;
      course.teacherName = teacherName;
      course.description = description;
      course.category = category || null;
      course.kind = kind || null


      // Update image if new file uploaded
    if (req.file) {
      // TODO: Add logic to delete old image file from server
      course.image = req.file.filename;
    }

      await course.save();

      // Delete old image after successful update
    if (req.file && oldImage) {
      try {
        await deleteImage(oldImage);
      } catch (fileErr) {
        console.error('Could not delete old image:', fileErr);
      }
    }
  
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update course' });
    }
  };
  
  // DELETE course (Admin only)
  exports.deleteCourse = async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      const imageToDelete = course.image;
      // TODO: Add logic to delete associated image file from server
    await course.destroy();
    // Delete associated image
    if (imageToDelete) {
      try {
        await deleteImage(imageToDelete);
      } catch (err) {
        console.error('Could not delete course image:', err);
      }
    }
      res.json({ message: 'Course deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  };
  
