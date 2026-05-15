const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskAssignee,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All task routes require authentication

// @route   GET /api/tasks/stats (must be before /:id)
router.get('/stats', getTaskStats);

// @route   GET /api/tasks
router.get('/', getTasks);

// @route   POST /api/tasks
router.post(
  '/',
  [
    body('title', 'Task title is required').notEmpty().trim(),
    body('project', 'Project ID is required').notEmpty(),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
    body('status').optional().isIn(['To Do', 'In Progress', 'In Review', 'Completed']),
  ],
  createTask
);

// @route   GET /api/tasks/:id
router.get('/:id', getTask);

// @route   PUT /api/tasks/:id
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().trim(),
    body('status').optional().isIn(['To Do', 'In Progress', 'In Review', 'Completed']),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
  ],
  updateTask
);

// @route   DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

// @route   PATCH /api/tasks/:id/status
router.patch(
  '/:id/status',
  [body('status', 'Status is required').isIn(['To Do', 'In Progress', 'In Review', 'Completed'])],
  updateTaskStatus
);

// @route   PATCH /api/tasks/:id/assignee
router.patch(
  '/:id/assignee',
  updateTaskAssignee
);

module.exports = router;
