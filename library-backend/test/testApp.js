const express = require('express');
const cors = require('cors');
const userRoutes = require('../routes/userRoutes');
const bookRoutes = require('../routes/bookRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;