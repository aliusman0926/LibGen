const request = require('supertest');
const app = require('../test/setup');
const mongoose = require('mongoose');
const User = require('../models/User');
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const Reservation = require('../models/Reservation');

// Debug: Log the app to ensure it's defined
console.log('App in bookRoutes.test.js:', app);

// Helper function to register a user and get a token
const getUserToken = async () => {
  const response = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

  return response.body.token;
};

// Helper function to create a book
const createBook = async (bookData) => {
  const book = new Book(bookData);
  await book.save();
  return book;
};

describe('Book Routes', () => {
  describe('GET /api/books/search', () => {
    it('should search for books with a matching query', async () => {
      await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: true,
      });

      const response = await request(app)
        .get('/api/books/search?query=Gatsby');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('The Great Gatsby');
    });

    it('should return empty array for non-matching query', async () => {
      await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: true,
      });

      const response = await request(app)
        .get('/api/books/search?query=Nonexistent');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/books/borrow', () => {
    it('should borrow an available book', async () => {
      const token = await getUserToken();
      const book = await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: true,
      });

      const response = await request(app)
        .post('/api/books/borrow')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookID: 1 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Book borrowed successfully');

      const updatedBook = await Book.findById(book._id);
      expect(updatedBook.availability).toBe(false);
    });

    it('should fail to borrow an unavailable book', async () => {
      const token = await getUserToken();
      await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: false,
      });

      const response = await request(app)
        .post('/api/books/borrow')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookID: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Book is not available');
    });

    it('should fail to borrow when at limit (5 books)', async () => {
      const token = await getUserToken();
      const user = await User.findOne({ email: 'test@example.com' });

      // Create 5 loans to reach the limit
      for (let i = 1; i <= 5; i++) {
        const book = await createBook({
          bookID: i,
          title: `Book ${i}`,
          author: 'Author',
          category: 'Fiction',
          availability: false,
        });

        const loan = new Loan({
          loanID: i,
          bookID: book._id,
          userID: user._id,
          dueDate: new Date(),
          returned: false,
        });
        await loan.save();

        user.loans.push(loan._id);
      }
      await user.save();

      // Create a new available book
      await createBook({
        bookID: 6,
        title: 'Book 6',
        author: 'Author',
        category: 'Fiction',
        availability: true,
      });

      const response = await request(app)
        .post('/api/books/borrow')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookID: 6 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Borrowing limit reached (5 books)');
    });
  });

  describe('POST /api/books/reserve', () => {
    it('should reserve an unavailable book', async () => {
      const token = await getUserToken();
      const book = await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: false,
      });

      const response = await request(app)
        .post('/api/books/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookID: 1 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Book reserved successfully');

      const reservation = await Reservation.findOne({ bookID: book._id });
      expect(reservation).toBeTruthy();
    });

    it('should fail to reserve an available book', async () => {
      const token = await getUserToken();
      await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: true,
      });

      const response = await request(app)
        .post('/api/books/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookID: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Book is available, you can borrow it directly');
    });
  });

  describe('POST /api/books/return', () => {
    it('should return a borrowed book', async () => {
      const token = await getUserToken();
      const user = await User.findOne({ email: 'test@example.com' });
      const book = await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: false,
      });

      const loan = new Loan({
        loanID: 1,
        bookID: book._id,
        userID: user._id,
        dueDate: new Date(),
        returned: false,
      });
      await loan.save();

      user.loans.push(loan._id);
      book.loans.push(loan._id);
      await user.save();
      await book.save();

      const response = await request(app)
        .post('/api/books/return')
        .set('Authorization', `Bearer ${token}`)
        .send({ loanID: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Book returned successfully');

      const updatedBook = await Book.findById(book._id);
      expect(updatedBook.availability).toBe(true);

      const updatedLoan = await Loan.findById(loan._id);
      expect(updatedLoan.returned).toBe(true);
    });
  });

  describe('GET /api/books/loan-history', () => {
    it('should fetch loan history', async () => {
      const token = await getUserToken();
      const user = await User.findOne({ email: 'test@example.com' });
      const book = await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: true,
      });

      const loan = new Loan({
        loanID: 1,
        bookID: book._id,
        userID: user._id,
        dueDate: new Date(),
        returned: true,
        returnedAt: new Date(),
      });
      await loan.save();

      const response = await request(app)
        .get('/api/books/loan-history')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].bookID.title).toBe('The Great Gatsby');
    });
  });

  describe('GET /api/books/reservations', () => {
    it('should fetch user reservations', async () => {
      const token = await getUserToken();
      const user = await User.findOne({ email: 'test@example.com' });
      const book = await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: false,
      });

      const reservation = new Reservation({
        reservationID: 1,
        bookID: book._id,
        userID: user._id,
      });
      await reservation.save();

      const response = await request(app)
        .get('/api/books/reservations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].bookID.title).toBe('The Great Gatsby');
    });
  });

  describe('DELETE /api/books/reservations/:reservationID', () => {
    it('should cancel a reservation', async () => {
      const token = await getUserToken();
      const user = await User.findOne({ email: 'test@example.com' });
      const book = await createBook({
        bookID: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        availability: false,
      });

      const reservation = new Reservation({
        reservationID: 1,
        bookID: book._id,
        userID: user._id,
      });
      await reservation.save();

      user.reservations.push(reservation._id);
      book.reservations.push(reservation._id);
      await user.save();
      await book.save();

      const response = await request(app)
        .delete('/api/books/reservations/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reservation cancelled successfully');

      const updatedReservation = await Reservation.findById(reservation._id);
      expect(updatedReservation).toBeNull();
    });
  });
});