const jwt = require("jsonwebtoken");

const ROLE_CREATION_SCOPE = {
  admin: ["admin", "finance_head", "finance_manager", "banker", "requester"],
  finance_head: ["finance_manager", "banker", "requester"],
  finance_manager: ["banker", "requester"],
};

const getCreatableRoles = (role) => ROLE_CREATION_SCOPE[role] || [];

const canManageRole = (actorRole, targetRole) =>
  getCreatableRoles(actorRole).includes(targetRole);

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

module.exports = {
  ROLE_CREATION_SCOPE,
  getCreatableRoles,
  canManageRole,
  generateToken,
};
