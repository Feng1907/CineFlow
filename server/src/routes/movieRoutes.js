const express = require('express');
const router = express.Router();
const movie = require('../controllers/movieController');
const tv    = require('../controllers/tvController');

// ── Movies ──────────────────────────────────────────────
router.get('/movies/popular',     movie.getPopular);
router.get('/movies/trending',    movie.getTrending);
router.get('/movies/top-rated',   movie.getTopRated);
router.get('/movies/now-playing', movie.getNowPlaying);
router.get('/movies/search',      movie.search);
router.get('/movies/upcoming',    movie.getUpcoming);
router.get('/movies/discover',    movie.discover);   // must be before /:id
router.get('/movies/:id',         movie.getDetail);

// ── TV Series ────────────────────────────────────────────
router.get('/tv/popular',         tv.getPopular);
router.get('/tv/trending',        tv.getTrending);
router.get('/tv/top-rated',       tv.getTopRated);
router.get('/tv/on-air',          tv.getOnAir);
router.get('/tv/discover',        tv.discover);      // must be before /:id
router.get('/tv/:id',             tv.getDetail);

// ── Genres ───────────────────────────────────────────────
router.get('/genres/movie',       movie.getGenres);
router.get('/genres/tv',          tv.getGenres);

module.exports = router;
