import Layout from '../components/Layout';

const ReserveBook = () => {
  const handleReserve = () => {
    // Handle reserve logic here
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Reserve a Book</h1>
        <div className="max-w-lg mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-100">Desired Book Title</h2>
          <p className="text-gray-400">Author: Author Name</p>
          <p className="text-red-400">Status: Checked Out</p>
          <p className="text-gray-400">Available: Estimated April 10, 2025</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReserve}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReserveBook;