const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mle: { type: String, required: true },
  nom: { type: String, required: true },
  role: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
