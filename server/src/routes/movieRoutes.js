const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movieController');

router.get('/movies/popular', ctrl.getPopular);
router.get('/movies/trending', ctrl.getTrending);
router.get('/movies/top-rated', ctrl.getTopRated);
router.get('/movies/now-playing', ctrl.getNowPlaying);
router.get('/movies/search', ctrl.search);
router.get('/movies/discover', ctrl.discover);  // must be before /:id
router.get('/movies/:id', ctrl.getDetail);
router.get('/genres/movie', ctrl.getGenres);

module.exports = router;
