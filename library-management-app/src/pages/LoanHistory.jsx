import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../utils/api';

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await apiRequest('/books/loan-history', 'GET', null, token);
        setLoans(data);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    fetchLoanHistory();
  }, []);

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Loan History</h1>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {loans.length === 0 ? (
          <p className="text-gray-400 text-center">You have no loan history.</p>
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
                  Borrowed On: {new Date(loan.borrowedAt).toLocaleDateString()}
                </p>
                {loan.returned ? (
                  <p className="text-gray-400">
                    Returned On: {new Date(loan.returnedAt).toLocaleDateString()}
                  </p>
                ) : (
                  <>
                    <p className="text-gray-400">
                      Due Date: {new Date(loan.dueDate).toLocaleDateString()}
                    </p>
                    <p className={new Date(loan.dueDate) < new Date() ? 'text-red-400' : 'text-yellow-400'}>
                      Status: {new Date(loan.dueDate) < new Date() ? 'Overdue' : 'Due'}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LoanHistory;