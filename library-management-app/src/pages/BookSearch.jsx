import Layout from '../components/Layout';

const BookSearch = () => {
  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Search Books</h1>
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((book) => (
            <div
              key={book}
              className="bg-gray-700 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-100">Book Title {book}</h2>
              <p className="text-gray-400">Author Name</p>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-1 bg-transparent border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BookSearch;