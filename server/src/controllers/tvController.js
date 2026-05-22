const tmdb = require('../services/tmdbService');

const wrap = (fn) => async (req, res, next) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    next(err);
  }
};

exports.getPopular  = wrap((req) => tmdb.getTVPopular(req.query.page));
exports.getTrending = wrap((req) => tmdb.getTVTrending(req.query.timeWindow || 'week'));
exports.getTopRated = wrap((req) => tmdb.getTVTopRated(req.query.page));
exports.getOnAir    = wrap((req) => tmdb.getTVOnAir(req.query.page));
exports.getDetail   = wrap((req) => tmdb.getTVDetail(req.params.id));
exports.getGenres   = wrap(() => tmdb.getTVGenres());

exports.discover = wrap((req) => {
  const { genre_id, country, sort_by, page } = req.query;
  return tmdb.discoverTV({ genre_id, country, sort_by, page });
});
