import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api/axios'; // Sesuaikan path axios Anda

export default function AdminLayout({ children, user = { name: 'Admin', role: 'Administrator' }, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  // Ambil data pesanan untuk menghitung jumlah pending secara otomatis
  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const response = await API.get('/orders');
      const allOrders = response.data.data || [];
      
      // Hitung jumlah yang statusnya 'pending' (case-insensitive)
      const count = allOrders.filter(o => (o.stt || '').toLowerCase() === 'pending').length;
      setPendingCount(count);
    } catch (error) {
      console.error('Gagal mengambil jumlah pending:', error);
    }
  };

  const menuGroups = [
    {
      groupTitle: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
      ]
    },
    {
      groupTitle: 'OPERASIONAL',
      items: [
        // badge menggunakan state pendingCount jika id-nya 'orders'
        { id: 'orders', label: 'Pesanan Cetak', icon: '📄', path: '/orders', badge: pendingCount > 0 ? pendingCount : null },
        { id: 'services', label: 'Layanan & Price', icon: '🖨️', path: '/services' },
        { id: 'papers', label: 'Stok Kertas / Bahan', icon: '📦', path: '/papers' },
        { id: 'payments', label: 'Pembayaran', icon: '💳', path: '/payments' },
      ]
    },
    {
      groupTitle: 'MANAJEMEN',
      items: [
        { id: 'customers', label: 'Data Pelanggan', icon: '👥', path: '/pelanggan' },
        { id: 'reports', label: 'Laporan Keuangan', icon: '📈', path: '/reports' },
        { id: 'users', label: 'Kelola Pengguna', icon: '⚙️', path: '/users' },
      ]
    }
  ];

  // Tentukan active menu berdasarkan path URL saat ini
  const currentPath = location.pathname;

  return (
    <div className="container-fluid px-0 min-vh-100 d-flex flex-column bg-light">
      {/* ================= TOP BAR / HEADER ================= */}
      <header className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm sticky-top px-3">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            type="button"
          >
            ☰
          </button>
          <a className="navbar-brand fw-bold text-primary m-0" href="#!">
            🖨️ DB DESIGN
          </a>
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="text-end d-none d-sm-block">
            <div className="fw-bold text-dark small">{user.name}</div>
            <div className="text-muted text-capitalize" style={{ fontSize: '0.75rem' }}>{user.role}</div>
          </div>
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '38px', height: '38px' }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <button 
            onClick={onLogout}
            className="btn btn-outline-danger btn-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="d-flex flex-grow-1">
        {/* ================= LEFT BAR / SIDEBAR ================= */}
        <aside 
          className="bg-white border-end flex-shrink-0"
          style={{ 
            width: sidebarOpen ? '250px' : '70px', 
            transition: 'width 0.2s ease-in-out'
          }}
        >
          <div className="p-2">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="mb-3">
                {sidebarOpen && (
                  <div 
                    className="text-muted fw-bold mb-2 px-2" 
                    style={{ fontSize: '0.65rem', letterSpacing: '0.05rem' }}
                  >
                    {group.groupTitle}
                  </div>
                )}

                <div className="nav nav-pills flex-column gap-1">
                  {group.items.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <Link 
                        key={item.id}
                        to={item.path} 
                        className={`nav-link d-flex align-items-center justify-content-between px-2 py-2 ${
                          isActive ? 'active bg-primary text-white' : 'text-dark'
                        }`}
                        title={!sidebarOpen ? item.label : ''}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-6">{item.icon}</span>
                          {sidebarOpen && <span className="text-truncate">{item.label}</span>}
                        </div>

                        {sidebarOpen && item.badge !== null && item.badge !== undefined && item.badge !== 0 && (
                          <span className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-danger text-white'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-top py-3 px-4 text-center text-sm-start d-sm-flex justify-content-between align-items-center text-muted small">
        <div>&copy; {new Date().getFullYear()} DB DESIGN. Hak Cipta Dilindungi.</div>
        <div className="mt-1 mt-sm-0">Sistem Manajemen Percetakan Dokumen</div>
      </footer>
    </div>
  );
}