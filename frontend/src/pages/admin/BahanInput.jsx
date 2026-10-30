
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function BahanInput() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nama: '',
    ket: '',
    Harga: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await API.post('/bahan', form);

      if (response.data.success) {
        setMessage(
          response.data.message || 'Bahan berhasil ditambahkan.'
        );

        setTimeout(() => {
          navigate('/bahan');
        }, 1000);
      } else {
        setError(
          response.data.message || 'Bahan gagal ditambahkan.'
        );
      }

    } catch (err) {
      console.error('Gagal menyimpan bahan:', err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(
          err.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan bahan.'
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
          <h2>Tambah Bahan Cetak</h2>
          <p>Masukkan informasi bahan cetak baru.</p>
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
            <label htmlFor="Nama">Nama Bahan</label>
            <input
              type="text"
              id="Nama"
              name="Nama"
              value={form.Nama}
              onChange={handleChange}
              placeholder="Masukkan nama bahan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Harga">Harga</label>
            <input
              type="number"
              id="Harga"
              name="Harga"
              value={form.Harga}
              onChange={handleChange}
              placeholder="Masukkan harga"
              min="0"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="ket">Keterangan</label>
            <textarea
              id="ket"
              name="ket"
              rows="4"
              value={form.ket}
              onChange={handleChange}
              placeholder="Keterangan bahan cetak..."
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
              onClick={() => navigate('/bahan')}
              disabled={saving}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Bahan'}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}

export default BahanInput;
