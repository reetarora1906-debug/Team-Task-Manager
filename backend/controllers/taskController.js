const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks (with filtering)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { project, status, assignee, priority } = req.query;
    let filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (priority) filter.priority = priority;

    // Both Admins and Members can only see tasks from their projects
    const userProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).select('_id');

    const projectIds = userProjects.map((p) => p._id);
    filter.project = filter.project
      ? { $in: [filter.project].filter((id) => projectIds.some(pId => pId.toString() === id.toString())) }
      : { $in: projectIds };

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name status')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name status');

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task',
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, description, project, assignee, priority, dueDate, status } = req.body;

    // Verify project exists
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Members can only create tasks in their projects
    if (req.user.role === 'Member') {
      const isMember = projectDoc.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );
      const isOwner = projectDoc.owner.toString() === req.user._id.toString();

      if (!isMember && !isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create tasks in this project',
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignee: assignee || null,
      creator: req.user._id,
      priority: priority || 'Medium',
      dueDate,
      status: status || 'To Do',
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name status');

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Completed tasks cannot be edited' });
    }

    const updateData = {};
    const allowedFields = ['title', 'description', 'assignee', 'status', 'priority', 'dueDate'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'assignee' ? (req.body[field] || null) : req.body[field];
      }
    });

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    )
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name status');

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
    });
  }
};

// @desc    Update task assignee
// @route   PATCH /api/tasks/:id/assignee
// @access  Private
const updateTaskAssignee = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Completed tasks cannot be edited' });
    }

    const { assignee } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { assignee: assignee || null },
      { returnDocument: 'after' }
    )
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name status');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task assignee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task assignee',
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin or task creator)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Only Admin or task creator can delete
    if (
      req.user.role !== 'Admin' &&
      task.creator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
    });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Completed tasks cannot be edited' });
    }

    const { status } = req.body;

    if (!['To Do', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    )
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('project', 'name status');

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task status',
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    let projectFilter = {};

    // Filter by projects the user has access to
    const userProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).select('_id');
    projectFilter = { project: { $in: userProjects.map((p) => p._id) } };

    const totalTasks = await Task.countDocuments(projectFilter);
    const todoTasks = await Task.countDocuments({ ...projectFilter, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...projectFilter, status: 'In Progress' });
    const completedTasks = await Task.countDocuments({ ...projectFilter, status: 'Completed' });

    const overdueTasks = await Task.countDocuments({
      ...projectFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' },
    });

    const totalProjects = await Project.countDocuments({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    });

    // Recent tasks
    const recentTasks = await Task.find(projectFilter)
      .populate('assignee', 'name email avatar')
      .populate('project', 'name')
      .sort('-updatedAt')
      .limit(10);

    // Performance Data (Tasks completed per day for last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const perfAggregation = await Task.aggregate([
      {
        $match: {
          ...projectFilter,
          status: 'Completed',
          updatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    const performanceData = last7Days.map(date => {
      const match = perfAggregation.find(p => p._id === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: match ? match.count : 0
      };
    });

    res.json({
      success: true,
      data: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        totalProjects,
        recentTasks,
        performanceData
      },
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskAssignee,
  getTaskStats,
};
