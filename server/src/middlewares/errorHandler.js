// Centralized error handler — converts TMDB/axios errors to clean JSON responses
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.response?.status || 500;
  const message =
    err.response?.data?.status_message || err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method}] ${req.path} →`, status, message);
  }

  res.status(status).json({ success: false, error: message });
};

module.exports = errorHandler;
