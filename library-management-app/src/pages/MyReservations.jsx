import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../utils/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ message: '', type: '', visible: false });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await apiRequest('/books/reservations', 'GET', null, token);
        setReservations(data);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    fetchReservations();
  }, []);

  const handleBorrow = async (bookID) => {
    try {
      const token = localStorage.getItem('token');
      const data = await apiRequest('/books/borrow', 'POST', { bookID }, token);
      setPopup({ message: data.message, type: 'success', visible: true });
      // Refresh reservations
      const updatedReservations = await apiRequest('/books/reservations', 'GET', null, token);
      setReservations(updatedReservations);
    } catch (err) {
      setPopup({ message: err.message, type: 'error', visible: true });
    }
    setTimeout(() => setPopup({ ...popup, visible: false }), 3000);
  };

  const handleCancel = async (reservationID) => {
    try {
      const token = localStorage.getItem('token');
      const data = await apiRequest(`/books/reservations/${reservationID}`, 'DELETE', null, token);
      setPopup({ message: data.message, type: 'success', visible: true });
      // Refresh reservations
      const updatedReservations = await apiRequest('/books/reservations', 'GET', null, token);
      setReservations(updatedReservations);
    } catch (err) {
      setPopup({ message: err.message, type: 'error', visible: true });
    }
    setTimeout(() => setPopup({ ...popup, visible: false }), 3000);
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg relative">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">My Reservations</h1>
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
        {reservations.length === 0 ? (
          <p className="text-gray-400 text-center">You have no current reservations.</p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="max-w-lg mx-auto bg-gray-700 rounded-lg shadow-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-100">{reservation.bookID.title}</h2>
                <p className="text-gray-400">Author: {reservation.bookID.author}</p>
                <p className={reservation.bookID.availability ? 'text-green-400' : 'text-red-400'}>
                  Status: {reservation.bookID.availability ? 'Available' : 'Checked Out'}
                </p>
                <p className="text-gray-400">
                  Reserved On: {new Date(reservation.reservationDate).toLocaleDateString()}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  {reservation.bookID.availability && (
                    <button
                      onClick={() => handleBorrow(reservation.bookID.bookID)}
                      className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Borrow
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(reservation.reservationID)}
                    className="px-4 py-1 bg-transparent border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Cancel
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

export default MyReservations;