const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const paymentRequestRoutes = require('./routes/paymentRequestRoutes');
const settingRoutes = require('./routes/settingRoutes');
const approvalRuleRoutes = require('./routes/approvalRuleRoutes');
const notFound = require('./middlewares/notFoundMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');

const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
  .filter(Boolean)
  .flatMap((v) => v.split(','))
  .map(normalizeOrigin)
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  if (configuredOrigins.includes(normalized)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized)) return true;
  if (process.env.NODE_ENV !== 'production') {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized);
  }
  return false;
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      const err = new Error(`CORS blocked for origin: ${origin}`);
      err.statusCode = 403;
      return callback(err);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({ success: true, message: 'PayApprove API is running' });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payment-requests', paymentRequestRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/approval-rules', approvalRuleRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
