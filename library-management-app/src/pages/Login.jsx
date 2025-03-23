import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiRequest from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/users/login', 'POST', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.user.name, email })); // Store user data
      navigate('/search');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-12 p-6">
          <div className="text-center lg:text-right">
            <h1 className="text-5xl font-bold text-indigo-400">Welcome Back</h1>
            <p className="mt-4 text-gray-400">Log in to access your LibGen account.</p>
          </div>
          <div className="w-full max-w-sm bg-gray-700 rounded-lg shadow-lg p-6">
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full px-4 py-2 bg-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-4 py-2 bg-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;