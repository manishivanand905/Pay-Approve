const Project = require("../models/Project");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { syncApprovalRuleForProject } = require("./approvalRuleController");

const PROJECT_POPULATE = [
  { path: "manager", select: "name email role" },
  { path: "financeHead", select: "name email role" },
  { path: "banker", select: "name email role" },
];

const assertRole = async (userId, allowedRole, label) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error(`${label} user not found`);
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== allowedRole) {
    const error = new Error(`${label} must have role ${allowedRole}`);
    error.statusCode = 400;
    throw error;
  }
};

const getProjects = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.active !== undefined) {
    filters.isActive = req.query.active === "true";
  }

  const projects = await Project.find(filters)
    .populate(PROJECT_POPULATE)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(PROJECT_POPULATE);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({
    success: true,
    data: project,
  });
});

const createProject = asyncHandler(async (req, res) => {
  const { name, code, description, manager, financeHead, banker, escalationThreshold } =
    req.body;

  if (!name || !code || !manager || !financeHead || !banker || escalationThreshold === undefined) {
    res.status(400);
    throw new Error(
      "name, code, manager, financeHead, banker and escalationThreshold are required"
    );
  }

  const existingProject = await Project.findOne({ code: code.toUpperCase() });

  if (existingProject) {
    res.status(409);
    throw new Error("Project code already exists");
  }

  await assertRole(manager, "finance_manager", "Manager");
  await assertRole(financeHead, "finance_head", "Finance head");
  await assertRole(banker, "banker", "Banker");

  const project = await Project.create({
    name,
    code,
    description,
    manager,
    financeHead,
    banker,
    escalationThreshold,
  });

  await syncApprovalRuleForProject(project, {
    threshold: escalationThreshold,
    isActive: project.isActive,
  });

  const populatedProject = await Project.findById(project._id).populate(PROJECT_POPULATE);

  res.status(201).json({
    success: true,
    data: populatedProject,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const { name, code, description, manager, financeHead, banker, escalationThreshold, isActive } =
    req.body;

  if (code && code.toUpperCase() !== project.code) {
    const existingProject = await Project.findOne({ code: code.toUpperCase() });

    if (existingProject) {
      res.status(409);
      throw new Error("Project code already exists");
    }
  }

  if (manager) {
    await assertRole(manager, "finance_manager", "Manager");
  }

  if (financeHead) {
    await assertRole(financeHead, "finance_head", "Finance head");
  }

  if (banker) {
    await assertRole(banker, "banker", "Banker");
  }

  project.name = name ?? project.name;
  project.code = code?.toUpperCase() ?? project.code;
  project.description = description ?? project.description;
  project.manager = manager ?? project.manager;
  project.financeHead = financeHead ?? project.financeHead;
  project.banker = banker ?? project.banker;
  project.escalationThreshold = escalationThreshold ?? project.escalationThreshold;
  project.isActive = isActive ?? project.isActive;

  await project.save();
  await syncApprovalRuleForProject(project, {
    threshold: project.escalationThreshold,
    isActive: project.isActive,
  });

  const populatedProject = await Project.findById(project._id).populate(PROJECT_POPULATE);

  res.json({
    success: true,
    data: populatedProject,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.isActive = false;
  await project.save();
  await syncApprovalRuleForProject(project, { isActive: false });

  res.json({
    success: true,
    message: "Project archived successfully",
  });
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
