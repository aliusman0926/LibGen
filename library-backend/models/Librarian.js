const mongoose = require('mongoose');

const librarianSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Inherit from User
  librarianID: { type: Number, required: true, unique: true },
});

module.exports = mongoose.model('Librarian', librarianSchema);