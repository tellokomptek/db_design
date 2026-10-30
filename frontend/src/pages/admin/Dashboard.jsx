import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';



export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk menampung nilai statistik dinamis
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processOrders, setProcessOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

// Di dalam komponen Anda:
const navigate = useNavigate();

const handleLogout = () => {
  // 1. Hapus data sesi login dari localStorage
  localStorage.removeItem('user');
  
  // 2. Arahkan ke halaman login dengan opsi replace: true
  // 'replace: true' berfungsi menimpa history browser sehingga tombol back tidak bisa kembali ke dashboard
  navigate('/', { replace: true });
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/orders');
      const allOrders = response.data.data;

      // 1. Total Pesanan
      setTotalOrders(allOrders.length);

      // 2. Hitung berdasarkan status (sesuaikan dengan nilai field 'stt' di database Anda)
      const pending = allOrders.filter(o => o.stt?.toLowerCase() === 'pending').length;
      const process = allOrders.filter(o => o.stt?.toLowerCase() === 'proses' || o.stt?.toLowerCase() === 'processing').length;
      const completed = allOrders.filter(o => o.stt?.toLowerCase() === 'selesai' || o.stt?.toLowerCase() === 'completed').length;

      setPendingOrders(pending);
      setProcessOrders(process);
      setCompletedOrders(completed);

      // 3. Hitung Pendapatan Hari Ini (opsional, berdasarkan tanggal created_at hari ini)
      const todayStr = new Date().toISOString().split('T')[0];
      const revenue = allOrders
        .filter(o => o.created_at?.startsWith(todayStr))
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);
      
      setTodayRevenue(revenue);

      // 4. Ambil 5 data teratas untuk tabel pesanan terbaru
      setRecentOrders(allOrders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Gagal memuat data dashboard:', error);
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Pesanan', value: totalOrders, icon: '📄', bg: 'bg-primary' },
    { title: 'Pending', value: pendingOrders, icon: '⏳', bg: 'bg-warning' },
    { title: 'Proses', value: processOrders, icon: '🔄', bg: 'bg-info' },
    { title: 'Selesai', value: completedOrders, icon: '✅', bg: 'bg-success' },
    { 
      title: 'Pendapatan Hari Ini', 
      value: `Rp ${Number(todayRevenue).toLocaleString('id-ID')}`, 
      icon: '💰', 
      bg: 'bg-secondary' 
    },
  ];

  return (
    <AdminLayout onLogout={handleLogout}>
      {/* Title */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Dashboard Utama</h3>
        <p className="text-muted small">Ringkasan aktivitas dan operasional percetakan hari ini.</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {stats.map((item, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div 
                  className={`${item.bg} text-white rounded p-3 d-flex align-items-center justify-content-center fs-4`}
                  style={{ width: '48px', height: '48px' }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-muted small fw-semibold text-uppercase">{item.title}</div>
                  <div className="fs-5 fw-bold text-dark">{item.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Pesanan Terbaru */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h6 className="m-0 fw-bold text-dark">Pesanan Dokumen Terbaru</h6>
          <button className="btn btn-link btn-sm text-decoration-none p-0">Lihat Semua</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small uppercase">
              <tr>
                <th className="ps-4">ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Dokumen</th>
                <th>Halaman</th>
                <th>Opsi Kertas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Memuat data...</td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-semibold">#{order.id}</td>
                    <td>{order.nama}</td>
                    <td className="text-primary fw-medium">{order.file_name}</td>
                    <td>{order.total_pages} hlm</td>
                    <td>{order.option_name || 'Standard'}</td>
                    <td>
                      <span className="badge bg-secondary">{order.stt || 'Pending'}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Belum ada data pesanan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}