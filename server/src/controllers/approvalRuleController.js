const ApprovalRule = require("../models/ApprovalRule");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const RULE_POPULATE = {
  path: "project",
  select: "name code description escalationThreshold isActive manager financeHead banker",
  populate: [
    { path: "manager", select: "name email role" },
    { path: "financeHead", select: "name email role" },
    { path: "banker", select: "name email role" },
  ],
};

const syncApprovalRuleForProject = async (project, overrides = {}) => {
  const projectId = project._id || project;
  const threshold =
    overrides.threshold ??
    project.escalationThreshold ??
    overrides.escalationThreshold ??
    0;
  const financeHeadRequired = overrides.financeHeadRequired ?? true;
  const isActive = overrides.isActive ?? project.isActive ?? true;

  return ApprovalRule.findOneAndUpdate(
    { project: projectId },
    {
      $set: {
        threshold,
        financeHeadRequired,
        isActive,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

const getApprovalRules = asyncHandler(async (req, res) => {
  const projectFilters = {};

  if (req.query.active !== undefined) {
    projectFilters.isActive = req.query.active === "true";
  }

  const projects = await Project.find(projectFilters).select(
    "_id escalationThreshold isActive"
  );

  await Promise.all(projects.map((project) => syncApprovalRuleForProject(project)));

  const ruleFilters = {};

  if (req.query.active !== undefined) {
    ruleFilters.isActive = req.query.active === "true";
  }

  const rules = await ApprovalRule.find(ruleFilters)
    .populate(RULE_POPULATE)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: rules.length,
    data: rules,
  });
});

const createApprovalRule = asyncHandler(async (req, res) => {
  const { project: projectId, threshold, financeHeadRequired = true } = req.body;

  if (!projectId || threshold === undefined) {
    res.status(400);
    throw new Error("project and threshold are required");
  }

  const project = await Project.findById(projectId);

  if (!project || !project.isActive) {
    res.status(404);
    throw new Error("Project not found or inactive");
  }

  const existingRule = await ApprovalRule.findOne({ project: projectId });

  if (existingRule) {
    res.status(409);
    throw new Error("An approval rule already exists for this project");
  }

  project.escalationThreshold = threshold;
  await project.save();

  const rule = await ApprovalRule.create({
    project: projectId,
    threshold,
    financeHeadRequired,
    isActive: project.isActive,
  });

  const populatedRule = await ApprovalRule.findById(rule._id).populate(RULE_POPULATE);

  res.status(201).json({
    success: true,
    data: populatedRule,
  });
});

const updateApprovalRule = asyncHandler(async (req, res) => {
  const { threshold, financeHeadRequired } = req.body;
  const rule = await ApprovalRule.findById(req.params.id);

  if (!rule) {
    res.status(404);
    throw new Error("Approval rule not found");
  }

  const project = await Project.findById(rule.project);

  if (!project) {
    res.status(404);
    throw new Error("Linked project not found");
  }

  if (threshold !== undefined) {
    rule.threshold = threshold;
    project.escalationThreshold = threshold;
  }

  if (financeHeadRequired !== undefined) {
    rule.financeHeadRequired = financeHeadRequired;
  }

  rule.isActive = project.isActive;

  await Promise.all([rule.save(), project.save()]);

  const populatedRule = await ApprovalRule.findById(rule._id).populate(RULE_POPULATE);

  res.json({
    success: true,
    data: populatedRule,
  });
});

module.exports = {
  getApprovalRules,
  createApprovalRule,
  updateApprovalRule,
  syncApprovalRuleForProject,
};
