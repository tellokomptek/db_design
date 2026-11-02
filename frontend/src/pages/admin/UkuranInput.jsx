
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function UkuranInput() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ukuran: '',
    satuan: '',
    aktif: '1',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
  // 1. Hapus data sesi login dari localStorage
  localStorage.removeItem('user');
  
  // 2. Arahkan ke halaman login dengan opsi replace: true
  // 'replace: true' berfungsi menimpa history browser sehingga tombol back tidak bisa kembali ke dashboard
  navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await API.post('/ukuran', form);

      if (response.data.success) {
        setMessage(
          response.data.message || 'Ukuran berhasil ditambahkan.'
        );

        setTimeout(() => {
          navigate('/ukuran');
        }, 1000);
      } else {
        setError(
          response.data.message || 'Ukuran gagal ditambahkan.'
        );
      }

    } catch (err) {
      console.error('Gagal menyimpan ukuran:', err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(
          err.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan ukuran.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="product-form-page">

        <div className="product-form-header">
          <h2>Tambah Ukuran Cetak</h2>
          <p>Masukkan informasi ukuran cetak baru.</p>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>

          {message && (
            <div className="alert alert-success form-alert">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger form-alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="Nama">Nama ukuran</label>
            <input
              type="text"
              id="ukuran"
              name="ukuran"
              value={form.ukuran}
              onChange={handleChange}
              placeholder="Masukkan nama ukuran"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="satuan">Satuan</label>
            <input
              type="text"
              id="satuan"
              name="satuan"
              value={form.satuan}
              onChange={handleChange}
              placeholder="Masukkan satuan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aktif">Status</label>
            <select
              id="aktif"
              name="aktif"
              value={form.aktif}
              onChange={handleChange}
            >
              <option value="1">Aktif</option>
              <option value="0">Tidak Aktif</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/ukuran')}
              disabled={saving}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan ukuran'}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}

export default UkuranInput;
