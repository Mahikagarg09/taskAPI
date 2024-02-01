// userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  priority: { type: Number, required: true },
});

const User = mongoose.model('Tasks-User', userSchema);

module.exports = User;
