require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const seedDefaultAdmin = require('./utils/seedDefaultAdmin');

const PORT = process.env.PORT || 5000;

const validateEnvironment = () => {
  const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);
};

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();
    await seedDefaultAdmin();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
