require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedDefaultAdmin = require("./utils/seedDefaultAdmin");

const PORT = process.env.PORT || 5000;
const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"];

const validateEnvironment = () => {
  const missingVariables = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missingVariables.length) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
};

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();
    await seedDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
