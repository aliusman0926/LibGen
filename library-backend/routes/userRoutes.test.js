const request = require('supertest');
const app = require('../test/setup');
const mongoose = require('mongoose');
const User = require('../models/User');

// Debug: Log the app to ensure it's defined
console.log('App in userRoutes.test.js:', app);

describe('User Routes', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user with valid input', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user.name).toBe('Test User');
    });

    it('should fail to register with an existing email', async () => {
      // Create a user
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      // Try to register with the same email
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should fail to register with missing fields', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: '',
          password: 'password123',
        });

      expect(response.status).toBe(500); // Due to validation or parsing error
    });
  });

  describe('POST /api/users/login', () => {
    it('should login with valid credentials', async () => {
      // Register a user
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      // Login with the same credentials
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('name', 'Test User');
    });

    it('should fail to login with incorrect password', async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail to login with unregistered email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'notregistered@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});