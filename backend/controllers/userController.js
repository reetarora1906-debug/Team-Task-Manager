const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    let query = {};
    
    // If not Admin, only show users who are on the team
    if (req.user.role !== 'Admin') {
      query = { isOnTeam: true };
    }

    const users = await User.find(query).select('name email role isOnTeam adminTeams avatar createdAt');
    
    // Get all projects owned by the current admin to identify their team members
    const adminProjects = await Project.find({ owner: req.user._id });
    const projectMemberIds = new Set();
    adminProjects.forEach(p => {
      p.members.forEach(m => projectMemberIds.add(m.user.toString()));
    });

    // Map users to include a dynamic isOnTeam flag based on the current admin or project membership
    const mappedUsers = users.map(u => {
      const userObj = u.toObject();
      const isExplicitlyAdded = userObj.adminTeams?.some(adminId => adminId.toString() === req.user._id.toString());
      const isProjectMember = projectMemberIds.has(userObj._id.toString());
      
      userObj.isOnTeam = isExplicitlyAdded || isProjectMember || false;
      return userObj;
    });

    res.json({
      success: true,
      count: mappedUsers.length,
      data: mappedUsers,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email role avatar createdAt');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, avatar },
      { returnDocument: 'after', runValidators: true }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['Admin', 'Member'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('name email role avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating role',
    });
  }
};

// @desc    Toggle team membership (Admin only)
// @route   PATCH /api/users/:id/team
const toggleTeamMembership = async (req, res) => {
  try {
    const { isOnTeam } = req.body;
    
    const update = isOnTeam 
      ? { $addToSet: { adminTeams: req.user._id } }
      : { $pull: { adminTeams: req.user._id } };

    const user = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { returnDocument: 'after' }
    ).select('name email role adminTeams avatar');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If removing from team, also remove from all projects owned by this admin
    if (!isOnTeam) {
      await Project.updateMany(
        { owner: req.user._id },
        { $pull: { members: { user: req.params.id } } }
      );
    }

    const userObj = user.toObject();
    userObj.isOnTeam = isOnTeam;

    res.json({ success: true, data: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating team membership' });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateProfile,
  updateUserRole,
  toggleTeamMembership,
};
