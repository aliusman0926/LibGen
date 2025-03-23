const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookID: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  availability: { type: Boolean, default: true },
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }], // 1-to-many with Loan
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // 1-to-many with Reservation
});

module.exports = mongoose.model('Book', bookSchema);