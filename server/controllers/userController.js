const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { canManageRole, getCreatableRoles } = require('../utils/auth');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildScopedUserQuery = (user) => {
  if (user.role === 'admin') return {};
  const manageableRoles = getCreatableRoles(user.role);
  if (!manageableRoles.length) {
    const error = new Error('You do not have permission to manage users');
    error.statusCode = 403;
    throw error;
  }
  return { $or: [{ _id: user._id }, { role: { $in: manageableRoles } }] };
};

const getUsers = asyncHandler(async (req, res) => {
  const filters = buildScopedUserQuery(req.user);
  if (req.query.role) {
    if (!canManageRole(req.user.role, req.query.role) && req.query.role !== req.user.role) {
      res.status(403);
      throw new Error('You do not have permission to view users with this role');
    }
    filters.role = req.query.role;
  }
  if (req.query.active !== undefined) filters.isActive = req.query.active === 'true';
  const users = await User.find(filters).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users.map(sanitizeUser) });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (!canManageRole(req.user.role, user.role) && String(user._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to view this user');
  }
  res.json({ success: true, data: sanitizeUser(user) });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('name, email, password and role are required');
  }
  if (!canManageRole(req.user.role, role)) {
    res.status(403);
    throw new Error(`The ${req.user.role} role cannot create ${role} accounts`);
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) { res.status(409); throw new Error('A user with this email already exists'); }
  const user = await User.create({ name, email, password, role, department });
  res.status(201).json({ success: true, data: sanitizeUser(user) });
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, isActive } = req.body;
  const user = await User.findById(req.params.id).select('+password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (email && email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) { res.status(409); throw new Error('A user with this email already exists'); }
  }
  if (role && role !== user.role && !canManageRole(req.user.role, role)) {
    res.status(403);
    throw new Error(`The ${req.user.role} role cannot assign ${role}`);
  }
  if (!canManageRole(req.user.role, user.role) && String(user._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You do not have permission to update this user');
  }
  user.name = name ?? user.name;
  user.email = email?.toLowerCase() ?? user.email;
  user.role = role ?? user.role;
  user.department = department ?? user.department;
  user.isActive = isActive ?? user.isActive;
  if (password) user.password = password;
  const updated = await user.save();
  res.json({ success: true, data: sanitizeUser(updated) });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (!canManageRole(req.user.role, user.role)) {
    res.status(403);
    throw new Error('You do not have permission to deactivate this user');
  }
  if (user.role === 'admin' && user.isActive) {
    const count = await User.countDocuments({ role: 'admin', isActive: true });
    if (count <= 1) { res.status(400); throw new Error('At least one active admin must remain'); }
  }
  user.isActive = false;
  await user.save();
  res.json({ success: true, message: 'User deactivated successfully' });
});

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
