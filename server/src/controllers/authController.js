const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

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
    res.status(201).json({ success: true, token: signToken(user._id), user });
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

    res.json({ success: true, token: signToken(user._id), user });
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => res.json({ success: true, user: req.user });
