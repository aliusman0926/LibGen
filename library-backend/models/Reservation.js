const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationID: { type: Number, required: true, unique: true },
  bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reservationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', reservationSchema);