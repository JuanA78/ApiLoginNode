const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  question: String,
  answer: String
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.answer = await bcrypt.hash(this.answer, 10);
  next();
});

userSchema.methods.comparePassword = function (pass) {
  return bcrypt.compare(pass, this.password);
};

userSchema.methods.compareAnswer = function (ans) {
  return bcrypt.compare(ans, this.answer);
};

module.exports = mongoose.model('User', userSchema);
