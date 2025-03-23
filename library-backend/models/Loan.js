const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanID: { type: Number, required: true, unique: true },
  bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  borrowedAt: { type: Date, default: Date.now },
  returned: { type: Boolean, default: false }, // Track if the loan is returned
  returnedAt: { type: Date, default: null }, // Track when the loan was returned
});

module.exports = mongoose.model('Loan', loanSchema);