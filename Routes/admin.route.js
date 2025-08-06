const express = require('express');
const adminRouter = express.Router();
const Course = require('../models/course.model.js');
const { auth, adminRoute } = require('../middleware/auth.middleware.js')

//admin get all courses

adminRouter.get('/courses', auth, adminRoute, async (req, res) => {
   try {
      const courses = await Course.find();
      if(!courses || courses.length === 0) {
         return res.status(404).json({ message: 'No courses found' });
      }

    } catch (error){
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

adminRouter.post('/create-course', auth, adminRoute, async (req, res) => {
    try {
      const { title, description, price, imageURL} = req.body;

      if (!title || !description || !price || !imageURL) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const course = new Course({
        title,
        description,
        price,
        imageURL,
        instructor: req.user.userId
      });

      await course.save();
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
})

module.exports = adminRouter;