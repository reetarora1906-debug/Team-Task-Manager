const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  updateUserRole,
  toggleTeamMembership,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

// @route   GET /api/users
router.get('/', getUsers);

// @route   PUT /api/users/profile
router.put('/profile', updateProfile);

// @route   GET /api/users/:id
router.get('/:id', getUser);

// @route   PUT /api/users/:id/role (Admin only)
router.put('/:id/role', requireRole('Admin'), updateUserRole);

// @route   PATCH /api/users/:id/team (Admin only)
router.patch('/:id/team', requireRole('Admin'), toggleTeamMembership);

module.exports = router;
