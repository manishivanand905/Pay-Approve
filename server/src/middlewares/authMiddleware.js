const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, token missing");
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("Not authorized, user unavailable");
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(401);
    }

    next(error);
  }
};

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error("You do not have permission to access this resource"));
  }

  return next();
};

module.exports = {
  protect,
  allowRoles,
};
