
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function BahanList() {
  const navigate = useNavigate();

  const [bahanList, setBahanList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/bahan');

      const data = response.data?.data ?? response.data;
      setBahanList(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error('Gagal mengambil data bahan:', err);
      setError(
        err.response?.data?.message ||
        'Gagal mengambil data bahan.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = bahanList.filter((item) =>
    [item.Nama, item.ket]
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
    <AdminLayout>
      <div className="product-list-page">

        <div className="product-list-header">
          <div>
            <h2>Master Bahan Cetak</h2>
            <p>Kelola data bahan cetak.</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/bahan/create')}
          >
            + Tambah Bahan
          </button>
        </div>

        <div className="product-list-toolbar">
          <input
            type="text"
            placeholder="Cari nama bahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {loading ? (
          <div className="alert alert-info">
            Memuat data bahan...
          </div>
        ) : (
          <>
            <div className="product-list-table-wrapper">
              <table className="product-list-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Nama Bahan</th>
                    <th>Keterangan</th>
                    <th>Harga</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.ID}>
                        <td>{index + 1}</td>
                        <td><strong>{item.Nama}</strong></td>
                        <td>{item.ket || '-'}</td>
                        <td>{formatHarga(item.Harga)}</td>
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
                                navigate(`/bahan/edit/${item.ID}`)
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
                        Data bahan tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="product-list-footer">
              Total data: {filteredData.length} bahan
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default BahanList;
