
import { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

export default function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [bahanList, setBahanList] = useState([]);
  const [ukuranList, setUkuranList] = useState([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const STORAGE_URL = 'http://192.168.0.52:8001/storage';

  useEffect(() => {
    loadData();
  }, []);

  // Mengambil semua data
  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [resProduct, resBahan, resUkuran] = await Promise.all([
        API.get('/products'),
        API.get('/bahan'),
        API.get('/ukuran'),
      ]);

      setProducts(
        Array.isArray(resProduct.data)
          ? resProduct.data
          : resProduct.data.data || []
      );

      setBahanList(
        Array.isArray(resBahan.data)
          ? resBahan.data
          : resBahan.data.data || []
      );

      setUkuranList(
        Array.isArray(resUkuran.data)
          ? resUkuran.data
          : resUkuran.data.data || []
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Gagal mengambil data produk dari server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Mencari nama bahan berdasarkan ID
  const getNamaBahan = (id) => {
    const item = bahanList.find(
      (bahan) => String(bahan.ID) === String(id)
    );

    return item ? item.Nama : '-';
  };

  // Mencari ukuran berdasarkan ID
  const getNamaUkuran = (id) => {
    const item = ukuranList.find(
      (ukuran) => String(ukuran.ID) === String(id)
    );

    return item
      ? `${item.ukuran} ${item.satuan || ''}`.trim()
      : '-';
  };

  // URL foto produk
  const getPhotoUrl = (photo) => {
    if (!photo) return null;

    return `${STORAGE_URL}/uploads/${photo}`;
  };

  // Filter pencarian
  const filteredProducts = products.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      String(item.kode || '').toLowerCase().includes(keyword) ||
      String(item.nama || '').toLowerCase().includes(keyword) ||
      String(item.desc_ || '').toLowerCase().includes(keyword)
    );
  });

  // Hapus produk
  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus produk "${item.nama}"?`
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${item.ID}`);

      alert('Produk berhasil dihapus.');

      loadData();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Gagal menghapus produk.'
      );
    }
  };

  return (
    <AdminLayout>

      <div className="product-list-page">

        {/* Header */}
        <div className="product-list-header">
          <div>
            <h2>Daftar Produk</h2>
            <p>Kelola seluruh data produk.</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/products/create')}
          >
            + Tambah Produk
          </button>
        </div>

        {/* Pencarian */}
        <div className="product-list-toolbar">
          <input
            type="text"
            className="form-control"
            placeholder="Cari kode atau nama produk..."
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

        {/* Pesan error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Tabel */}
        <div className="product-list-table-wrapper">
          <table className="table table-hover align-middle product-list-table">

            <thead>
              <tr>
                <th>No.</th>
                <th>Foto</th>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>Jenis Kertas</th>
                <th>Ukuran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Data produk tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item, index) => (
                  <tr key={item.ID}>

                    <td>{index + 1}</td>

                    <td>
                      {item.photo ? (
                        <img
                          src={getPhotoUrl(item.photo)}
                          alt={item.nama}
                          className="product-list-photo"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="product-no-photo">
                          No Image
                        </div>
                      )}
                    </td>

                    <td>{item.kode}</td>

                    <td>
                      <strong>{item.nama}</strong>

                      {item.desc_ && (
                        <div className="product-list-description">
                          {item.desc_}
                        </div>
                      )}
                    </td>

                    <td>
                      {getNamaBahan(item.jenis_kertas)}
                    </td>

                    <td>
                      {getNamaUkuran(item.ukuran_kertas)}
                    </td>

                    <td>
                      {Number(item.aktif) === 1 ? (
                        <span className="badge bg-success">
                          Aktif
                        </span>
                      ) : (
                        <span className="badge bg-secondary">
                          Tidak Aktif
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="product-list-actions">

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            navigate(`/products/edit/${item.ID}`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item)}
                        >
                          Hapus
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        <div className="product-list-footer">
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </div>

      </div>

    </AdminLayout>
  );
}
