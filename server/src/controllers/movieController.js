const tmdb = require('../services/tmdbService');

const wrap = (fn) => async (req, res, next) => {
  try {
    const data = await fn(req, res);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getPopular = wrap((req) => tmdb.getPopular(req.query.page));

exports.getTrending = wrap((req) =>
  tmdb.getTrending(req.query.timeWindow || 'day')
);

exports.getTopRated = wrap((req) => tmdb.getTopRated(req.query.page));

exports.getNowPlaying = wrap((req) => tmdb.getNowPlaying(req.query.page));

exports.search = wrap((req) => {
  const { query, page } = req.query;
  if (!query) throw Object.assign(new Error('query param is required'), { status: 400 });
  return tmdb.searchMovies(query, page);
});

exports.getDetail = wrap((req) => tmdb.getMovieDetail(req.params.id));

exports.getGenres = wrap(() => tmdb.getGenres());
