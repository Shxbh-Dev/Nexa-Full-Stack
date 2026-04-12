// backend/routes/userRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js'; // <-- ADDED: Security middleware!

const router = express.Router();

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);

// @desc    Register a new user
// @route   POST /api/users
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400); 
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password, // This gets hashed automatically by our pre-save hook!
    });

    if (user) {
      generateToken(res, user._id); // Instantly log them in
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    // Make sure it is an admin trying to do this
    if (!req.user.isAdmin) {
      res.status(401); 
      throw new Error('Not authorized as an Admin');
    }
    
    // Fetch all users from the database, but don't send their passwords back!
    const users = await User.find({}).select('-password');
    res.json(users);
  })
);

// @desc    Update user profile & password
// @route   PUT /api/users/profile
// @access  Private
router.put(
  '/profile',
  protect, // <-- Requires a valid login token!
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // ONLY update the password if the user actually typed a new one in the form
      if (req.body.password) {
        user.password = req.body.password; 
      }

      const updatedUser = await user.save(); // This automatically hashes the new password!

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  })
);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect, // <-- Requires login
  asyncHandler(async (req, res) => {
    // Make sure it is an admin trying to do this
    if (!req.user.isAdmin) {
      res.status(401); 
      throw new Error('Not authorized as an Admin');
    }
    
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Prevent admins from accidentally deleting other admins
      if (user.isAdmin) {
        res.status(400); 
        throw new Error('Cannot delete another admin user');
      }
      
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404); 
      throw new Error('User not found');
    }
  })
);

export default router;