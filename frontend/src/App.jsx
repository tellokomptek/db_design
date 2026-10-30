
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from './pages/LoginApp';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Pelanggan from './pages/admin/Pelanggan';
import ClientLayout from './layout/ClientLayout';
import Home from './pages/client/Home';
import Products from './pages/client/Products';
import ProductInput from './pages/admin/ProductInput';
import ProductList from './pages/admin/ProductList.jsx';
import ProductEdit from './pages/admin/ProductEdit';

// Proteksi halaman berdasarkan login dan role
function ProtectedRoute({ children, role }) {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/'} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman client */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<Products />} />
        </Route>


        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/products/create" 
          element={
            <ProtectedRoute role="admin">
            <ProductInput />
            </ProtectedRoute>
          } 
        />

      <Route
        path="/products/edit/:id"
        element={
          <ProtectedRoute role="admin">
          <ProductEdit />
          </ProtectedRoute>
        }
        />

        <Route 
          path="/products" 
          element={
            <ProtectedRoute role="admin">
            <ProductList />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="admin">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pelanggan"
          element={
            <ProtectedRoute role="admin">
              <Pelanggan />
            </ProtectedRoute>
          }
        />

        {/* Rute yang tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
