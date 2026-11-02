
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function BahanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const imageBaseUrl = 'http://192.168.0.52:8001/storage/uploads/';

  const [form, setForm] = useState({
    Nama: '',
    ket: '',
    Harga: '',
    aktif: '1',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

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

  // Ambil data bahan berdasarkan ID
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Bersihkan URL preview foto sementara
  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get(`/bahan/${id}`);

      console.log('RESPONS BAHAN:', response.data);

      const bahan = response.data?.data;

      if (!bahan) {
        throw new Error('Data bahan tidak ditemukan.');
      }

      setForm({
        Nama: bahan.Nama ?? bahan.nama ?? '',
        ket: bahan.ket ?? '',
        Harga: String(bahan.Harga ?? bahan.harga ?? ''),
        aktif: String(bahan.aktif ?? '1'),
      });

      // Tampilkan foto lama
      if (bahan.photo) {
        setPhotoPreview(`${imageBaseUrl}${bahan.photo}`);
      } else {
        setPhotoPreview('');
      }

      // Reset file foto baru
      setPhotoFile(null);

      console.log('DATA BAHAN:', bahan);

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

  // Pilih foto baru
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Foto harus berformat JPG atau JPEG.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Simpan perubahan bahan
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();

      formData.append('Nama', form.Nama);
      formData.append('ket', form.ket);
      formData.append('Harga', form.Harga);
      formData.append('aktif', form.aktif);

      // Foto hanya dikirim jika memilih foto baru
      if (photoFile) {
        formData.append('photo', photoFile, photoFile.name);
      }

      // Laravel membaca multipart sebagai PUT
      formData.append('_method', 'PUT');

      const response = await API.post(`/bahan/${id}`, formData);

      console.log('HASIL UPDATE:', response.data);

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
    <AdminLayout onLogout={handleLogout}>
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

            {/* Upload foto */}
            <div className="form-group full-width">
              <label htmlFor="photo">Foto Bahan</label>

              <input
                type="file"
                id="photo"
                name="photo"
                accept=".jpg,.jpeg,image/jpeg"
                onChange={handlePhotoChange}
              />

              <small>
                Pilih foto baru jika ingin mengganti foto lama.
                Format JPG/JPEG, maksimal 5 MB.
              </small>

              {photoPreview && (
                <div className="photo-preview">
                  <img
                    src={photoPreview}
                    alt="Preview bahan"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  <small>
                    {photoFile ? 'Foto baru' : 'Foto saat ini'}
                  </small>
                </div>
              )}
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
