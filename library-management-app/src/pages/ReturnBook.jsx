import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../utils/api';

const ReturnBook = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch user's loans on component mount
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await apiRequest('/books/loans', 'GET', null, token);
        setLoans(data);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    fetchLoans();
  }, []);

  const handleReturn = async (loanID) => {
    try {
      const token = localStorage.getItem('token');
      const data = await apiRequest('/books/return', 'POST', { loanID }, token);
      setMessage(data.message);
      setError('');
      // Refresh the loans list
      const updatedLoans = await apiRequest('/books/loans', 'GET', null, token);
      setLoans(updatedLoans);
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Return a Book</h1>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-400 mb-4 text-center">{message}</p>}
        {loans.length === 0 ? (
          <p className="text-gray-400 text-center">You have no books currently loaned.</p>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="max-w-lg mx-auto bg-gray-700 rounded-lg shadow-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-100">{loan.bookID.title}</h2>
                <p className="text-gray-400">Author: {loan.bookID.author}</p>
                <p className="text-gray-400">
                  Due Date: {new Date(loan.dueDate).toLocaleDateString()}
                </p>
                <p className="text-yellow-400">
                  Status: {new Date(loan.dueDate) < new Date() ? 'Overdue' : 'Due'}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleReturn(loan.loanID)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Return Now
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

export default ReturnBook;