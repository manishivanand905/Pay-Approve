const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/auth");

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

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400);
    throw new Error("email, password and role are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (user.role !== role) {
    res.status(403);
    throw new Error(`This account is not assigned to the ${role} role`);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    data: sanitizeUser(user),
  });
});

const signupRequester = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    department,
    role: "requester",
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    data: sanitizeUser(user),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: sanitizeUser(req.user),
  });
});

module.exports = {
  login,
  signupRequester,
  getCurrentUser,
};
