
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function UkuranList() {
  const navigate = useNavigate();

  const [UkuranList, setUkuranList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
  // 1. Hapus data sesi login dari localStorage
  localStorage.removeItem('user');
  
  // 2. Arahkan ke halaman login dengan opsi replace: true
  // 'replace: true' berfungsi menimpa history browser sehingga tombol back tidak bisa kembali ke dashboard
  navigate('/', { replace: true });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/ukuran');

      const data = response.data?.data ?? response.data;
      setUkuranList(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error('Gagal mengambil data ukuran:', err);
      setError(
        err.response?.data?.message ||
        'Gagal mengambil data ukuran.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = UkuranList.filter((item) =>
    [item.ukuran, item.satuan]
      .some((value) =>
        String(value ?? '').toLowerCase().includes(search.toLowerCase())
      )
  );

  const formatHarga = (harga) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(harga) || 0);
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="product-list-page">

        <div className="product-list-header">
          <div>
            <h2>Master ukuran Cetak</h2>
            <p>Kelola data ukuran cetak.</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/ukuran/create')}
          >
            + Tambah ukuran
          </button>
        </div>

        {/* Pencarian */}
        <div className="product-list-toolbar">
          <input
            type="text"
            className="form-control"
            placeholder="Cari Ukuran Kertas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary"
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {loading ? (
          <div className="alert alert-info">
            Memuat data ukuran...
          </div>
        ) : (
          <>
            <div className="product-list-table-wrapper">
              <table className="product-list-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Ukuran</th>
                    <th>Satuan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.ID}>
                        <td>{index + 1}</td>
                        <td><strong>{item.ukuran}</strong></td>
                        <td>{item.satuan || '-'}</td>
                        <td>
                          <span className={
                            Number(item.aktif) === 1
                              ? 'badge bg-success'
                              : 'badge bg-secondary'
                          }>
                            {Number(item.aktif) === 1
                              ? 'Aktif'
                              : 'Tidak Aktif'}
                          </span>
                        </td>
                        <td>
                          <div className="product-list-actions">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                navigate(`/ukuran/edit/${item.ID}`)
                              }
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Data ukuran tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="product-list-footer">
              Total data: {filteredData.length} ukuran
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default UkuranList;
