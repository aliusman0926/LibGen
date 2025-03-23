import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import BookSearch from './pages/BookSearch';
import BorrowBook from './pages/BorrowBook';
import ReturnBook from './pages/ReturnBook';
import ReserveBook from './pages/ReserveBook';
import LoanHistory from './pages/LoanHistory';
import MyReservations from './pages/MyReservations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<BookSearch />} />
        <Route path="/borrow" element={<BorrowBook />} />
        <Route path="/return" element={<ReturnBook />} />
        <Route path="/reserve" element={<ReserveBook />} />
        <Route path="/loan-history" element={<LoanHistory />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/" element={<BookSearch />} />
      </Routes>
    </Router>
  );
}

export default App;