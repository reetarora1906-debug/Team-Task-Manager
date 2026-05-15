const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const {
  register,
  login,
  getMe,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role', 'Role must be Admin or Member').optional().isIn(['Admin', 'Member']),
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  login
);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   GET /api/auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  googleCallback
);

module.exports = router;
