const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const mongoose   = require('mongoose');
const { allowedOrigins, port } = require('./config/env');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes  = require('./routes/authRoutes');
const userRoutes  = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Security ─────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
}));

app.use(express.json());

// ── MongoDB ───────────────────────────────────────────────
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.warn('⚠️  MongoDB connection failed:', err.message, '\n   → Kiểm tra IP Whitelist trên MongoDB Atlas: Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)'));
} else {
  console.warn('⚠️  MONGODB_URI not set — auth features disabled');
}

// ── Routes ────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api',      movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
