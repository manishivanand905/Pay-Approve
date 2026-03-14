const User = require("../models/User");

const seedDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "admin", isActive: true });

  if (existingAdmin) {
    return;
  }

  const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@paybuild.local";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";

  await User.create({
    name: process.env.DEFAULT_ADMIN_NAME || "System Admin",
    email,
    password,
    role: "admin",
    department: "Administration",
  });

  console.log(`Default admin created: ${email}`);
};

module.exports = seedDefaultAdmin;
