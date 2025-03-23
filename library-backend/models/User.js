const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }], // 1-to-many with Loan
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // 1-to-many with Reservation
});

module.exports = mongoose.model('User', userSchema);