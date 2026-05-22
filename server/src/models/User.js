const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const movieRefSchema = new mongoose.Schema({
  id:          { type: Number, required: true },
  title:       String,
  poster_path: String,
  type:        { type: String, enum: ['movie', 'tv'], default: 'movie' },
  addedAt:     { type: Date, default: Date.now },
}, { _id: false });

const historySchema = new mongoose.Schema({
  id:          { type: Number, required: true },
  title:       String,
  poster_path: String,
  type:        { type: String, enum: ['movie', 'tv'], default: 'movie' },
  watchedAt:   { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar:       { type: String, default: null },
  favorites:    { type: [movieRefSchema], default: [] },
  watchlist:    { type: [movieRefSchema], default: [] },
  watchHistory: { type: [historySchema], default: [] },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Never return password hash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
