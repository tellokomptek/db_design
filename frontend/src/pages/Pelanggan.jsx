import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import API from '../api/axios';

export default function Pelanggan() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/pelanggan');
      setCustomers(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal memuat data pelanggan:', err);
      setError('Gagal terhubung ke server untuk memuat data pelanggan.');
      setLoading(false);
    }
  };

  return (
    <AdminLayout activeMenu="customers" onLogout={handleLogout}>
      {/* Header Halaman */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Data Pelanggan</h3>
          <p className="text-muted small">Daftar pelanggan yang pernah melakukan pesanan cetak.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchCustomers}>
          🔄 Refresh Data
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabel Data Pelanggan */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small uppercase">
                <tr>
                  <th className="ps-4">ID User</th>
                  <th>Nama Pelanggan</th>
                  <th>Kontak (Email / Phone)</th>
                  <th>Tanggal Gabung</th>
                  <th>Total Order</th>
                  <th className="pe-4">Order Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Memuat data pelanggan...
                    </td>
                  </tr>
                ) : customers.length > 0 ? (
                  customers.map((cust) => (
                    <tr key={cust.user_id}>
                      <td className="ps-4 fw-semibold">#{cust.user_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{cust.Nama || 'Tanpa Nama'}</div>
                        <span className="badge bg-secondary text-capitalize" style={{ fontSize: '0.7rem' }}>
                          {cust.stt || 'Customer'}
                        </span>
                      </td>
                      <td>
                        <div>{cust.email || '-'}</div>
                        <small className="text-muted">{cust.phone || '-'}</small>
                      </td>
                      <td>{cust.tgl_gabung || '-'}</td>
                      <td>
                        <span className="badge bg-primary rounded-pill px-2 py-1">
                          {cust.jml_order} Pesanan
                        </span>
                      </td>
                      <td className="pe-4 text-muted small">{cust.tgl_terakhir_order || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Belum ada data pelanggan.
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