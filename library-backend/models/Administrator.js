const mongoose = require('mongoose');

const administratorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Inherit from User
  adminID: { type: Number, required: true, unique: true },
});

module.exports = mongoose.model('Administrator', administratorSchema);