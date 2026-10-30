import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout'; // Sesuaikan path layout Anda
import API from '../../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Ambil semua data pesanan dari API
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders');
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal memuat data pesanan:', err);
      setError('Gagal terhubung ke server untuk memuat data pesanan.');
      setLoading(false);
    }
  };

  // 1. Fungsi Edit (bisa diarahkan ke form edit atau modal)
  const handleEdit = (id) => {
    alert(`Fitur edit untuk pesanan ID #${id} akan segera dibuat.`);
    // Contoh jika pakai router: navigate(`/orders/edit/${id}`);
  };

  // 2. Fungsi Ubah Status Cepat
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { stt: newStatus });
      fetchAllOrders(); // Refresh data setelah diubah
    } catch (err) {
      console.error('Gagal mengubah status:', err);
      alert('Gagal mengubah status pesanan.');
    }
  };

  // 3. Fungsi Hapus Pesanan
  const handleDelete = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan #${id}?`)) {
      try {
        await API.delete(`/orders/${id}`);
        fetchAllOrders(); // Refresh data setelah dihapus
      } catch (err) {
        console.error('Gagal menghapus pesanan:', err);
        alert('Gagal menghapus pesanan dari database.');
      }
    }
  };

  // Helper warna badge status
  const getStatusBadge = (status) => {
    const stt = (status || '').toLowerCase();
    if (stt === 'pending') return 'bg-warning text-dark';
    if (stt === 'proses' || stt === 'processing') return 'bg-info text-dark';
    if (stt === 'selesai' || stt === 'completed') return 'bg-success';
    return 'bg-secondary';
  };

  return (
    <AdminLayout activeMenu="orders" onLogout={handleLogout}>
      {/* Header Halaman */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Manajemen Pesanan Cetak</h3>
          <p className="text-muted small">Daftar keseluruhan dokumen dan pesanan masuk yang siap dikelola.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchAllOrders}>
          🔄 Refresh Data
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabel Data Pesanan */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small uppercase">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Pelanggan</th>
                  <th>Nama File & Catatan</th>
                  <th>Detail Cetak</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      Memuat daftar pesanan...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-semibold">#{order.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{order.nama || 'Tanpa Nama'}</div>
                      </td>
                      <td>
                        <div className="text-primary fw-medium">{order.file_name}</div>
                        <small className="text-muted">{order.notes || 'Tidak ada catatan'}</small>
                      </td>
                      <td>
                        <div>{order.option_name || 'Standard'}</div>
                        <small className="text-muted">
                          {order.total_pages} Hlm | {order.copies} Salinan | {order.color_mode}
                        </small>
                      </td>
                      <td className="fw-bold text-dark">
                        Rp {Number(order.total_price || 0).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.stt)} text-capitalize px-2 py-1`}>
                          {order.stt || 'Pending'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm" role="group">
                          {/* Tombol Edit */}
                          <button 
                            className="btn btn-outline-primary" 
                            title="Edit"
                            onClick={() => handleEdit(order.id)}
                          >
                            ✏️ Edit
                          </button>
                          
                          {/* Tombol Ubah Status Cepat (Proses / Selesai) */}
                          <button 
                            className="btn btn-outline-info" 
                            title="Ubah ke Proses"
                            onClick={() => handleUpdateStatus(order.id, 'proses')}
                          >
                            🔄 Proses
                          </button>
                          <button 
                            className="btn btn-outline-success" 
                            title="Ubah ke Selesai"
                            onClick={() => handleUpdateStatus(order.id, 'selesai')}
                          >
                            ✅ Selesai
                          </button>

                          <a 
  href={`http://192.168.0.52:8001/api/orders/${order.id}/download`} 
  className="btn btn-outline-primary btn-sm"
  target="_blank"
  rel="noopener noreferrer"
  title="Unduh Dokumen dari Google Drive"
>
  📥 Unduh File
</a>

                          {/* Tombol Hapus */}
                          <button 
                            className="btn btn-outline-danger" 
                            title="Hapus Pesanan"
                            onClick={() => handleDelete(order.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      Belum ada data pesanan yang masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}