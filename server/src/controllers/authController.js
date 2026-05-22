const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }); // access token 15 phút

const signRefresh = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh', { expiresIn: '30d' }); // refresh 30 ngày

const sendTokens = (res, user, status = 200) => {
  const token        = signToken(user._id);
  const refreshToken = signRefresh(user._id);
  // Lưu refresh token vào DB
  User.findByIdAndUpdate(user._id, { refreshToken }).catch(() => {});
  res.status(status).json({ success: true, token, refreshToken, user });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin' });
    if (password.length < 6)
      return res.status(400).json({ success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, error: 'Email đã được sử dụng' });

    const user = await User.create({ name, email, passwordHash: password });
    sendTokens(res, user, 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Vui lòng nhập email và mật khẩu' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });

    sendTokens(res, user);
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => res.json({ success: true, user: req.user });

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ success: false, error: 'Thiếu refresh token' });

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
    const payload = jwt.verify(refreshToken, secret);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ success: false, error: 'Refresh token không hợp lệ' });

    // Cấp access token mới
    const newToken = signToken(user._id);
    res.json({ success: true, token: newToken });
  } catch {
    res.status(401).json({ success: false, error: 'Refresh token hết hạn, vui lòng đăng nhập lại' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.json({ success: true });
  } catch (err) { next(err); }
};
