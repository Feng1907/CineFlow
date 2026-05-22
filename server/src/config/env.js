const requiredVars = ['TMDB_READ_ACCESS_TOKEN'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  port: process.env.PORT || 5000,
  tmdb: {
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    token: process.env.TMDB_READ_ACCESS_TOKEN,
  },
  // Allow frontend dev server and production origins
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:4173'],
};
