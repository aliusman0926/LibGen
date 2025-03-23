const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// Add a sample book (temporary route for testing)
router.post('/add', async (req, res) => {
    try {
      const books = [
        { bookID: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', availability: true },
        { bookID: 2, title: '1984', author: 'George Orwell', category: 'Dystopia', availability: true },
        { bookID: 3, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', availability: false },
      ];
  
      for (const bookData of books) {
        const book = new Book(bookData);
        await book.save();
      }
  
      res.status(201).json({ message: 'Sample books added' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Get user's current loans (active loans only)
router.get('/loans', auth, async (req, res) => {
    const userID = req.user.id;
  
    try {
      const loans = await Loan.find({ userID, returned: false }).populate('bookID');
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Search books
router.get('/search', async (req, res) => {
    const { query } = req.query; // e.g., /api/books/search?query=title
  
    try {
      const books = await Book.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Borrow a book (protected route)
router.post('/borrow', auth, async (req, res) => {
  const { bookID } = req.body;
  const userID = req.user.id;

  try {
    // Check if book exists and is available
    const book = await Book.findOne({ bookID });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (!book.availability) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if user has reached borrowing limit (5 books)
    const userLoans = await Loan.find({ userID });
    if (userLoans.length >= 5) {
      return res.status(400).json({ message: 'Borrowing limit reached (5 books)' });
    }

    // Create a new loan
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14-day loan period

    const loan = new Loan({
      loanID: Date.now(), // Simple unique ID (replace with a better method in production)
      bookID: book._id,
      userID,
      dueDate,
    });

    await loan.save();

    // Update book availability
    book.availability = false;
    book.loans.push(loan._id);
    await book.save();

    // Update user loans
    const user = await User.findById(userID);
    user.loans.push(loan._id);
    await user.save();

    res.status(201).json({ message: 'Book borrowed successfully', loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's loan history (active and returned loans)
router.get('/loan-history', auth, async (req, res) => {
    const userID = req.user.id;
  
    try {
      const loans = await Loan.find({ userID }).populate('bookID');
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Return a book (protected route)
router.post('/return', auth, async (req, res) => {
    const { loanID } = req.body;
    const userID = req.user.id;
  
    try {
      // Find the loan
      const loan = await Loan.findOne({ loanID, userID });
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
  
      // Update book availability
      const book = await Book.findById(loan.bookID);
      book.availability = true;
      book.loans = book.loans.filter((id) => id.toString() !== loan._id.toString());
      await book.save();
  
      // Remove loan from user
      const user = await User.findById(userID);
      user.loans = user.loans.filter((id) => id.toString() !== loan._id.toString());
      await user.save();
  
      // Mark loan as returned instead of deleting
      loan.returned = true;
      loan.returnedAt = new Date();
      await loan.save();
  
      res.json({ message: 'Book returned successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Reserve a book (protected route)
router.post('/reserve', auth, async (req, res) => {
  const { bookID } = req.body;
  const userID = req.user.id;

  try {
    // Check if book exists and is not available
    const book = await Book.findOne({ bookID });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availability) {
      return res.status(400).json({ message: 'Book is available, you can borrow it directly' });
    }

    // Check if user already has a reservation for this book
    const existingReservation = await Reservation.findOne({ bookID: book._id, userID });
    if (existingReservation) {
      return res.status(400).json({ message: 'You have already reserved this book' });
    }

    // Create a new reservation
    const reservation = new Reservation({
      reservationID: Date.now(), // Simple unique ID (replace with a better method in production)
      bookID: book._id,
      userID,
    });

    await reservation.save();

    // Update book and user reservations
    book.reservations.push(reservation._id);
    await book.save();

    const user = await User.findById(userID);
    user.reservations.push(reservation._id);
    await user.save();

    res.status(201).json({ message: 'Book reserved successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's current reservations
router.get('/reservations', auth, async (req, res) => {
    const userID = req.user.id;
  
    try {
      const reservations = await Reservation.find({ userID }).populate('bookID');
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Cancel a reservation
  router.delete('/reservations/:reservationID', auth, async (req, res) => {
    const { reservationID } = req.params;
    const userID = req.user.id;
  
    try {
      // Find the reservation
      const reservation = await Reservation.findOne({ reservationID, userID });
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      // Remove reservation from book
      const book = await Book.findById(reservation.bookID);
      book.reservations = book.reservations.filter(
        (id) => id.toString() !== reservation._id.toString()
      );
      await book.save();
  
      // Remove reservation from user
      const user = await User.findById(userID);
      user.reservations = user.reservations.filter(
        (id) => id.toString() !== reservation._id.toString()
      );
      await user.save();
  
      // Delete the reservation
      await Reservation.deleteOne({ _id: reservation._id });
  
      res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;