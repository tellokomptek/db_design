import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/LoginApp';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Pelanggan from './pages/Pelanggan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
      </Routes>
    </Router>
  );
}

// Contoh proteksi di App.jsx / Router
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

export default App;