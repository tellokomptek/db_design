
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function BahanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nama: '',
    ket: '',
    Harga: '',
    aktif: '1',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get(`/bahan/${id}`);

      const bahan = response.data?.data;

      if (!bahan) {
        throw new Error('Data bahan tidak ditemukan.');
      }

      setForm({
        Nama: bahan.Nama ?? '',
        ket: bahan.ket ?? '',
        Harga: String(bahan.Harga ?? ''),
        aktif: String(bahan.aktif ?? '1'),
      });

    } catch (err) {
      console.error('Gagal mengambil data bahan:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal mengambil data bahan.'
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
      const response = await API.put(`/bahan/${id}`, form);

      if (response.data.success) {
        setMessage(
          response.data.message || 'Bahan berhasil diperbarui.'
        );

        setTimeout(() => {
          navigate('/bahan');
        }, 1000);
      } else {
        setError(
          response.data.message || 'Bahan gagal diperbarui.'
        );
      }

    } catch (err) {
      console.error('Gagal memperbarui bahan:', err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(
          err.response?.data?.message ||
          'Terjadi kesalahan saat memperbarui bahan.'
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
          <h2>Edit Bahan Cetak</h2>
          <p>Ubah informasi bahan cetak yang sudah tersimpan.</p>
        </div>

        {loading ? (
          <div className="alert alert-info">
            Memuat data bahan...
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
              <label htmlFor="Nama">Nama Bahan</label>
              <input
                type="text"
                id="Nama"
                name="Nama"
                value={form.Nama}
                onChange={handleChange}
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
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        )}
      </div>
    </AdminLayout>
  );
}

export default BahanEdit;
