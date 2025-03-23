import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../utils/api';

const ReserveBook = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ message: '', type: '', visible: false });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest(`/books/search?query=${query}`);
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setBooks([]);
    }
  };

  const handleReserve = async (bookID) => {
    try {
      const token = localStorage.getItem('token');
      const data = await apiRequest('/books/reserve', 'POST', { bookID }, token);
      setPopup({ message: data.message, type: 'success', visible: true });
    } catch (err) {
      setPopup({ message: err.message, type: 'error', visible: true });
    }
    setTimeout(() => setPopup({ ...popup, visible: false }), 3000);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await apiRequest('/books/search?query=');
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg relative">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Reserve a Book</h1>
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="flex-1 px-4 py-2 bg-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {popup.visible && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-md text-white ${
              popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {popup.message}
          </div>
        )}
        {books.length === 0 ? (
          <p className="text-gray-400 text-center">
            {query ? 'No books found matching your search.' : 'No books available in the library.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-gray-700 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-100">{book.title}</h2>
                <p className="text-gray-400">Author: {book.author}</p>
                <p className="text-gray-400">Category: {book.category}</p>
                <p className={book.availability ? 'text-green-400' : 'text-red-400'}>
                  Status: {book.availability ? 'Available' : 'Checked Out'}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleReserve(book.bookID)}
                    className="px-4 py-1 bg-transparent border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition-colors"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReserveBook;