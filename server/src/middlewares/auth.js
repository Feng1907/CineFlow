const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Không có token xác thực' });
  }
  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-passwordHash');
    if (!req.user) return res.status(401).json({ success: false, error: 'Tài khoản không tồn tại' });
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = { verifyToken };
