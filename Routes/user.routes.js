const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const userRoute = express.Router();
const { auth } = require('../middleware/auth.middleware.js');
const User = require('../models/user.model.js'); 
const Purchase = require('../models/purchase.model.js');

userRoute.post('/signup', async (req, res) => {
   const signupSchema = z.object({
    name : z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role : z.enum(['user', 'admin']).optional().default('user'),
   })

  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: 'Validation error', errors: result.error.errors });
  }

  const { name, email, password } = result.data;


   try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

userRoute.post('/signin', async (req, res)=>{
  const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),});
    
    const result = signinSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: 'Validation error', errors: result.error.errors });
    }

    const { email, password } = result.data;
     

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });  
      }

      const token = jwt.sign({ userId: user._id, role : user.role }, process.env.JWT_SECRET, { expiresIn: '1D' });

      res.status(200).json({
        message: 'Signin successful',
        userId: user._id,
        token
      })

    } catch(error) {
      res.status(500).json({ message: 'Signin failed', error: error.message });
    }

})

userRoute.get('/:id/mypurchases', auth, async (req, res)=> {
  try {
    if (req.user.userId !== req.params.id){
      return res.status(403).json({ message: 'Forbidden' });
    }

    const purchases = await Purchase.find({ userID: req.params.id }).populate('courseID');
    if (!purchases || purchases.length === 0) {
      return res.status(200).json({ message: 'No courses purchased yet'});
    }
    res.status(200).json({ purchases });
  }catch(error){
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
   
})


module.exports = userRoute;