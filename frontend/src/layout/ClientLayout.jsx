
import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

export default function ClientLayout() {
  return (
    <div className="client-site">
      <header className="client-header">
        <div className="container client-navbar">
          <Link to="/" className="client-brand">
            <span className="brand-mark">D</span>
            <span>DB <b>Design</b></span>
          </Link>

          <nav className="client-nav">
            <NavLink to="/" end>Beranda</NavLink>
            <NavLink to="/produk">Produk</NavLink>
            <a href="#tentang">Tentang Kami</a>
            <a href="#kontak">Kontak</a>
          </nav>

          <div className="client-nav-actions">
            <Link to="/login" className="client-login">Login</Link>
            <Link to="/register" className="client-register">
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="client-footer" id="kontak">
        <div className="container footer-content">
          <div>
            <h5>DB Design</h5>
            <p>Solusi cetak dan desain untuk kebutuhan Anda.</p>
          </div>
          <div>
            <h6>Jelajahi</h6>
            <Link to="/">Beranda</Link>
            <Link to="/produk">Produk</Link>
          </div>
          <div>
            <h6>Hubungi Kami</h6>
            <p>Hubungi tim kami untuk informasi produk dan pemesanan.</p>
          </div>
        </div>
        <div className="container footer-bottom">
          © {new Date().getFullYear()} DB Design. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
