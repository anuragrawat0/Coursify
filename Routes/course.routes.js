const express = require('express');
const courseRoute = express.Router();
const Course = require('../models/course.model.js');
const { auth } = require('../middleware/auth.middleware.js');
const Purchase = require('../models/purchase.model.js');

courseRoute.get('/:id/purchasing', auth, async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.userId;
        
        const course = await Course.findById(courseId);
        if (!course){
            return res.status(404).json({ message: 'Course not found' });
        }

        const existingPurchase = await Purchase.findOne({
            userID : userId, courseID : courseId });

        if(existingPurchase) {
            return res.status(400).json({ message: 'You have already purchased this course' });
        }

        const purchase = new Purchase({ userID: userId, courseID: courseId });
        await purchase.save();

        res.status(201).json({
            message : 'Course purchased successfully',
            purchase : {
                id : purchase._id,
                course : course.title,
                user: userId
            }
        });
   } catch(error){
     res.status(500).json({ message: 'Error purchasing course', error: error.message });
   }
});

courseRoute.get('/preview', auth, async (req, res) => {
  try {
    const courses = await Course.find({});

    if (!courses.length) {
      return res.status(200).json({ message: 'No courses available.' });
    }

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }


})

module.exports = courseRoute;




