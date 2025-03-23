import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            LibGen
          </Link>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-indigo-400 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-gray-300 hover:text-indigo-400 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
};

export default Layout;