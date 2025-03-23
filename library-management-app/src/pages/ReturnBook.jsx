import Layout from '../components/Layout';

const ReturnBook = () => {
  const handleReturn = () => {
    // Handle return logic here
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Return a Book</h1>
        <div className="max-w-lg mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-100">Borrowed Book Title</h2>
          <p className="text-gray-400">Author: Author Name</p>
          <p className="text-gray-400">Due Date: April 6, 2025</p>
          <p className="text-yellow-400">Status: Due in 2 days</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReturn}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Return Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnBook;