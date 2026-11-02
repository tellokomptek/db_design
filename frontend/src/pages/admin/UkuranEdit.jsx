
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function UkuranEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ukuran: '',
    satuan: '',
    aktif: '1',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = () => {
  // 1. Hapus data sesi login dari localStorage
  localStorage.removeItem('user');
  
  // 2. Arahkan ke halaman login dengan opsi replace: true
  // 'replace: true' berfungsi menimpa history browser sehingga tombol back tidak bisa kembali ke dashboard
  navigate('/', { replace: true });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get(`/ukuran/${id}`);

      const ukuran = response.data?.data;

      if (!ukuran) {
        throw new Error('Data ukuran tidak ditemukan.');
      }

      setForm({
        ukuran: ukuran.ukuran ?? '',
        satuan: ukuran.satuan ?? '',
        aktif: String(ukuran.aktif ?? '1'),
      });

    } catch (err) {
      console.error('Gagal mengambil data ukuran:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal mengambil data ukuran.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await API.put(`/ukuran/${id}`, form);

      if (response.data.success) {
        setMessage(
          response.data.message || 'ukuran berhasil diperbarui.'
        );

        setTimeout(() => {
          navigate('/ukuran');
        }, 1000);
      } else {
        setError(
          response.data.message || 'ukuran gagal diperbarui.'
        );
      }

    } catch (err) {
      console.error('Gagal memperbarui ukuran:', err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(
          err.response?.data?.message ||
          'Terjadi kesalahan saat memperbarui ukuran.'
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
          <h2>Edit ukuran Cetak</h2>
          <p>Ubah informasi ukuran cetak yang sudah tersimpan.</p>
        </div>

        {loading ? (
          <div className="alert alert-info">
            Memuat data ukuran...
          </div>
        ) : (
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
              <label htmlFor="ukuran">Ukuran</label>
              <input
                type="text"
                id="ukuran"
                name="ukuran"
                value={form.ukuran}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group full-width">
              <label htmlFor="satuan">Satuan</label>
              <textarea
                id="satuan"
                name="satuan"
                rows="2"
                value={form.satuan}
                onChange={handleChange}
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
                {saving ? 'Menyimpan...' : 'Simpan Peruukuran'}
              </button>
            </div>

          </form>
        )}
      </div>
    </AdminLayout>
  );
}

export default UkuranEdit;
