const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./testApp');

let mongod;

// Setup the MongoDB connection before tests
beforeAll(async () => {
  // Start MongoDB in-memory server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Debug: Log the app to ensure it's initialized
  console.log('App initialized in setup.js:', app);
});

// Close MongoDB connection and stop the in-memory server after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

// Clear the database before each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

module.exports = app;