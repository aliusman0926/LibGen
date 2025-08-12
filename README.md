# Full-Stack Library Management System

A modern Library Management System built with Node.js, Express, MongoDB, and React. Manage books, borrowing, reservations, and user accounts efficiently.

## Features
- User registration and login with JWT authentication.
- Search, borrow, return, and reserve books.
- Track loan history and reservations.
- Responsive UI with Tailwind CSS.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS
- **Testing**: Jest, Supertest, mongodb-memory-server

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd library-management-system
   ```
3. Install dependencies for backend and frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the `backend` directory with `MONGO_URI` and `JWT_SECRET`.
5. Run the application:
   ```bash
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

## Testing
- Run unit tests in the `backend` directory:
  ```bash
  cd backend && npm test
  ```

## Contributing
Feel free to fork the repository, submit issues, or pull requests. Contributions are welcome!

## License
MIT License - See `LICENSE` file for details.
