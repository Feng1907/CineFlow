const User = require('../models/User');

// ── Helpers ──────────────────────────────────────────────
const extractItem = (body) => ({
  id:          body.id,
  title:       body.title,
  poster_path: body.poster_path || null,
  type:        body.type || 'movie',
});

// ── Favorites ─────────────────────────────────────────────
exports.getFavorites = (req, res) =>
  res.json({ success: true, results: req.user.favorites });

exports.addFavorite = async (req, res, next) => {
  try {
    const item = extractItem(req.body);
    if (!item.id) return res.status(400).json({ success: false, error: 'Thiếu id phim' });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favorites: { id: item.id } },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { favorites: { $each: [item], $position: 0 } },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favorites: { id: Number(req.params.id) } },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ── Watchlist ─────────────────────────────────────────────
exports.getWatchlist = (req, res) =>
  res.json({ success: true, results: req.user.watchlist });

exports.addWatchlist = async (req, res, next) => {
  try {
    const item = extractItem(req.body);
    if (!item.id) return res.status(400).json({ success: false, error: 'Thiếu id phim' });

    await User.findByIdAndUpdate(req.user._id, { $pull: { watchlist: { id: item.id } } });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { watchlist: { $each: [item], $position: 0 } },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.removeWatchlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchlist: { id: Number(req.params.id) } },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ── Watch History ─────────────────────────────────────────
exports.getHistory = (req, res) =>
  res.json({ success: true, results: req.user.watchHistory });

exports.addHistory = async (req, res, next) => {
  try {
    const item = { ...extractItem(req.body), watchedAt: new Date() };
    if (!item.id) return res.status(400).json({ success: false, error: 'Thiếu id phim' });

    // Remove duplicate, push to front, keep max 20
    await User.findByIdAndUpdate(req.user._id, { $pull: { watchHistory: { id: item.id } } });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { watchHistory: { $each: [item], $position: 0, $slice: 20 } } },
      { new: true }
    );
    res.json({ success: true, results: user.watchHistory });
  } catch (err) { next(err); }
};

exports.clearHistory = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { watchHistory: [] } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ── Profile ───────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: 'Tên không được để trống' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name: name.trim() } },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, error: 'Mật khẩu hiện tại không đúng' });

    user.passwordHash = newPassword;
    await user.save();
    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) { next(err); }
};
