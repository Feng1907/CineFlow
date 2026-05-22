const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { allowedOrigins } = require('./config/env');
const movieRoutes = require('./routes/movieRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow configured origins
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server calls (no origin) and configured origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET'],
  })
);

// 100 requests per 15 minutes per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
  })
);

app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api', movieRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Error handler must be last
app.use(errorHandler);

module.exports = app;
