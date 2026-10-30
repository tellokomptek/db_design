import { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

// const API_URL =
//   import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';

export default function ProductForm() {
  const [bahanList, setBahanList] = useState([]);
  const [ukuranList, setUkuranList] = useState([]);

  const [loadingMaster, setLoadingMaster] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // State untuk file foto dan preview
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [form, setForm] = useState({
    kode: '',
    nama: '',
    desc_: '',
    jenis_kertas: '',
    ukuran_kertas: '',
    aktif: 1,
  });

  // Mengambil data bahan dan ukuran dari Laravel
  useEffect(() => {
  const fetchMasterData = async () => {
    try {
      setLoadingMaster(true);
      setError('');

      const [resBahan, resUkuran] = await Promise.all([
        API.get('/bahan'),
        API.get('/ukuran'),
      ]);

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
        'Gagal mengambil data bahan atau ukuran.'
      );
    } finally {
      setLoadingMaster(false);
    }
  };

  fetchMasterData();
}, []);

  // Mengubah nilai form
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Memilih foto
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validasi format JPG/JPEG
    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Foto harus menggunakan format JPG atau JPEG.');
      e.target.value = '';
      return;
    }

    // Maksimal 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Simpan produk
  const handleSubmit = async (e) => {
  e.preventDefault();

  setSaving(true);
  setMessage('');
  setError('');

  try {
    const payload = new FormData();

    payload.append('kode', form.kode);
    payload.append('nama', form.nama);
    payload.append('desc_', form.desc_);
    payload.append('jenis_kertas', form.jenis_kertas);
    payload.append('ukuran_kertas', form.ukuran_kertas);
    payload.append('aktif', form.aktif);

    if (photoFile) {
      payload.append('photo', photoFile);
    }

    await API.post('/products', payload);

    setMessage('Produk berhasil disimpan!');

    setForm({
      kode: '',
      nama: '',
      desc_: '',
      jenis_kertas: '',
      ukuran_kertas: '',
      aktif: 1,
    });

    setPhotoFile(null);
    setPhotoPreview('');

    e.target.reset();

  } catch (err) {
    const result = err.response?.data;

    if (result?.errors) {
      const validationMessage = Object.values(result.errors)
        .flat()
        .join('\n');

      setError(validationMessage);
    } else {
      setError(
        result?.message ||
        'Terjadi kesalahan saat menyimpan produk.'
      );
    }
  } finally {
    setSaving(false);
  }
};

   return (
    <AdminLayout>
      <div className="product-form-page">

      <div className="product-form-header">
        <div>
          <h2>Tambah Produk</h2>
          <p>Masukkan informasi produk yang akan ditampilkan.</p>
        </div>
      </div>

      {message && (
        <div className="form-alert success">{message}</div>
      )}

      {error && (
        <div className="form-alert error" style={{ whiteSpace: 'pre-line' }}>
          {error}
        </div>
      )}

      {loadingMaster ? (
        <p>Memuat data bahan dan ukuran...</p>
      ) : (
        <form onSubmit={handleSubmit} className="product-form">

          <div className="form-group">
            <label>Kode Produk</label>
            <input
              type="text"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              placeholder="Contoh: PRD001"
              required
            />
          </div>

          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama produk"
              required
            />
          </div>

          <div className="form-group">
            <label>Jenis Kertas</label>
            <select
              name="jenis_kertas"
              value={form.jenis_kertas}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Jenis Kertas --</option>

              {bahanList.map((item) => (
                <option key={item.ID} value={item.ID}>
                  {item.Nama}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ukuran Kertas</label>
            <select
              name="ukuran_kertas"
              value={form.ukuran_kertas}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Ukuran Kertas --</option>

              {ukuranList.map((item) => (
                <option key={item.ID} value={item.ID}>
                  {item.ukuran} {item.satuan}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Deskripsi</label>
            <textarea
              name="desc_"
              value={form.desc_}
              onChange={handleChange}
              placeholder="Deskripsi produk..."
              rows="4"
            />
          </div>

          {/* Upload Foto Produk */}
          <div className="form-group full-width">
            <label>Foto Produk</label>

            <input
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              onChange={handlePhotoChange}
            />

            {photoPreview && (
              <div className="photo-preview mt-2">
                <img
                  src={photoPreview}
                  alt="Preview foto produk"
                />

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview('');
                  }}
                >
                  Hapus Foto
                </button>
              </div>
            )}

            <small className="text-muted">
              Format JPG/JPEG, maksimal 5 MB.
              Nama file akan otomatis mengikuti ID produk.
            </small>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="aktif"
              value={form.aktif}
              onChange={handleChange}
            >
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
          </div>

          <div className="form-actions full-width">
            <button type="submit" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>

        </form>
      )}
    </div>
    </AdminLayout>
  );
}
