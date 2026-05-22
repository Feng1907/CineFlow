const express = require('express');
const router = express.Router();
const u = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');

// All user routes require auth
router.use(verifyToken);

router.get('/favorites',          u.getFavorites);
router.post('/favorites',         u.addFavorite);
router.delete('/favorites/:id',   u.removeFavorite);

router.get('/watchlist',          u.getWatchlist);
router.post('/watchlist',         u.addWatchlist);
router.delete('/watchlist/:id',   u.removeWatchlist);

router.get('/history',            u.getHistory);
router.post('/history',           u.addHistory);
router.delete('/history',         u.clearHistory);

router.patch('/profile',          u.updateProfile);
router.patch('/password',         u.changePassword);

module.exports = router;
