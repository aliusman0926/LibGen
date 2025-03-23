import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            LibGen
          </Link>
          <div className="space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-300 hover:text-indigo-400 transition-colors focus:outline-none"
                >
                  Welcome, {user.name} ▼
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                    <Link
                      to="/loan-history"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-indigo-400 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Loan History
                    </Link>
                    <Link
                      to="/my-reservations"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-indigo-400 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Reservations
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-indigo-400 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <div className="container mx-auto px-4 py-2 flex justify-center space-x-4">
            <Link
              to="/borrow"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Borrow Book
            </Link>
            <Link
              to="/return"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Return Book
            </Link>
            <Link
              to="/reserve"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Reserve Book
            </Link>
          </div>
        )}
      </nav>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
};

export default Layout;