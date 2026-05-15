const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect); // All project routes require authentication

// @route   GET /api/projects
router.get('/', getProjects);

// @route   POST /api/projects (Admin only)
router.post(
  '/',
  requireRole('Admin'),
  [
    body('name', 'Project name is required').notEmpty().trim(),
    body('description').optional().trim(),
    body('category').optional().trim(),
    body('deadline').optional().isISO8601(),
  ],
  createProject
);

// @route   GET /api/projects/:id
router.get('/:id', getProject);

// @route   PUT /api/projects/:id (Admin only)
router.put(
  '/:id',
  requireRole('Admin'),
  [
    body('name').optional().notEmpty().trim(),
    body('status').optional().isIn(['Active', 'On Hold', 'Completed']),
  ],
  updateProject
);

// @route   DELETE /api/projects/:id (Admin only)
router.delete('/:id', requireRole('Admin'), deleteProject);

// @route   POST /api/projects/:id/members (Admin only)
router.post(
  '/:id/members',
  requireRole('Admin'),
  [body('userId', 'User ID is required').notEmpty()],
  addMember
);

// @route   DELETE /api/projects/:id/members/:userId (Admin only)
router.delete('/:id/members/:userId', requireRole('Admin'), removeMember);

module.exports = router;
