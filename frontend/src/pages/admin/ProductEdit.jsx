import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import API from '../../api/axios';
import '../../App.css';

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kode: '',
    nama: '',
    desc_: '',
    jenis_kertas: '',
    ukuran_kertas: '',
    aktif: '1',
  });

  const [bahanList, setBahanList] = useState([]);
  const [ukuranList, setUkuranList] = useState([]);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const imageBaseUrl = 'http://192.168.0.52:8001/storage/uploads/';

  useEffect(() => {
    loadData();

    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  
const loadData = async () => {
  setLoading(true);
  setError('');

  try {
    // 1. Ambil data produk terlebih dahulu
    const productRes = await API.get(`/products/${id}`);

    console.log('RESPONS PRODUK:', productRes.data);

    const product = productRes.data?.data;

    if (!product) {
      throw new Error('Data produk tidak ditemukan.');
    }

    // 2. Isi form produk
    setForm({
      kode: product.kode ?? '',
      nama: product.nama ?? '',
      desc_: product.desc_ ?? '',
      jenis_kertas: String(product.jenis_kertas ?? ''),
      ukuran_kertas: String(product.ukuran_kertas ?? ''),
      aktif: String(product.aktif ?? '1'),
    });

    // 3. Tampilkan foto lama jika tersedia
    if (product.photo) {
      setPhotoPreview(`${imageBaseUrl}${product.photo}`);
    } else {
      setPhotoPreview('');
    }

    console.log('FORM PRODUK:', {
      kode: product.kode,
      nama: product.nama,
      jenis_kertas: product.jenis_kertas,
      ukuran_kertas: product.ukuran_kertas,
    });

    // 4. Ambil master bahan dan ukuran secara terpisah
    const [bahanResult, ukuranResult] = await Promise.allSettled([
      API.get('/bahan'),
      API.get('/ukuran'),
    ]);

    if (bahanResult.status === 'fulfilled') {
      const result = bahanResult.value.data;
      const data = result?.data ?? result;

      setBahanList(Array.isArray(data) ? data : []);
    } else {
      console.error('Gagal mengambil bahan:', bahanResult.reason);
      setBahanList([]);
    }

    if (ukuranResult.status === 'fulfilled') {
      const result = ukuranResult.value.data;
      const data = result?.data ?? result;

      setUkuranList(Array.isArray(data) ? data : []);
    } else {
      console.error('Gagal mengambil ukuran:', ukuranResult.reason);
      setUkuranList([]);
    }

  } catch (err) {
    console.error('ERROR LOAD PRODUCT:', err);

    setError(
      err.response?.data?.message ||
      err.message ||
      'Gagal mengambil data produk.'
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

    if (photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }

    setError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();

      formData.append('kode', form.kode);
      formData.append('nama', form.nama);
      formData.append('desc_', form.desc_);
      formData.append('jenis_kertas', form.jenis_kertas);
      formData.append('ukuran_kertas', form.ukuran_kertas);
      formData.append('aktif', form.aktif);

      // Foto hanya dikirim jika user memilih foto baru.
      if (photoFile) {
        formData.append('photo', photoFile, photoFile.name);
        }
      // Method spoofing agar Laravel membaca multipart sebagai PUT.
      formData.append('_method', 'PUT');

      const response = await API.post(`/products/${id}`, formData);

      if (response.data.success) {
        setMessage(response.data.message || 'Produk berhasil diperbarui.');

        setTimeout(() => {
          navigate('/products');
        }, 1000);
      } else {
        setError(response.data.message || 'Produk gagal diperbarui.');
      }
    } catch (err) {
      console.error('Gagal memperbarui produk:', err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join(' '));
      } else {
        setError(
          err.response?.data?.message ||
          'Terjadi kesalahan saat memperbarui produk.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
  console.log('STATE FORM BERUBAH:', form);
}, [form]);

  return (
    <AdminLayout>
      <div className="product-form-page">

        <div className="product-form-header">
          <h2>Edit Produk</h2>
          <p>Ubah informasi produk yang sudah tersimpan.</p>
        </div>

        {loading ? (
          <div className="alert alert-info">
            Memuat data produk...
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
              <label htmlFor="kode">Kode Produk</label>
              <input
                type="text"
                id="kode"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nama">Nama Produk</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="jenis_kertas">Jenis Kertas</label>
              <select
                id="jenis_kertas"
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
              <label htmlFor="ukuran_kertas">Ukuran Kertas</label>
              <select
                id="ukuran_kertas"
                name="ukuran_kertas"
                value={form.ukuran_kertas}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Ukuran --</option>
                {ukuranList.map((item) => (
                  <option key={item.ID} value={item.ID}>
                    {item.ukuran} {item.satuan}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="desc_">Deskripsi Produk</label>
              <textarea
                id="desc_"
                name="desc_"
                rows="4"
                value={form.desc_}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="photo">Foto Produk</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept=".jpg,.jpeg,image/jpeg"
                onChange={handlePhotoChange}
              />
              <small>
                Pilih foto baru jika ingin mengganti foto lama. Format JPG/JPEG,
                maksimal 5 MB.
              </small>

              {photoPreview && (
                <div className="photo-preview">
                  <img
                    src={photoPreview}
                    alt="Preview produk"
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
              <label htmlFor="aktif">Status Produk</label>
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
                onClick={() => navigate('/products')}
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

export default ProductEdit;
