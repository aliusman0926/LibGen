import Layout from '../components/Layout';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-12 p-6">
          <div className="text-left lg:text-right">
            <h1 className="text-5xl font-bold text-indigo-400">Welcome Back</h1>
            <p className="mt-4 text-gray-400">Log in to access your library account.</p>
          </div>
          <div className="w-full max-w-sm bg-gray-700 rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
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