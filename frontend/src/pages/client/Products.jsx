
import React, { useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

const products = [
  { id: 1, name: 'Banner', category: 'Promosi', price: 50000 },
  { id: 2, name: 'Brosur', category: 'Media Cetak', price: 100000 },
  { id: 3, name: 'Kartu Nama', category: 'Identitas Bisnis', price: 75000 },
  { id: 4, name: 'Stiker', category: 'Label', price: 25000 },
  { id: 5, name: 'Poster', category: 'Promosi', price: 60000 },
  { id: 6, name: 'Spanduk', category: 'Promosi', price: 80000 }
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === 'Semua' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const formatPrice = price =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);

  return (
    <section className="client-products catalog-page">
      <div className="container">
        <div className="catalog-heading">
          <span className="section-eyebrow">KATALOG DB DESIGN</span>
          <h1>Temukan Produk Anda</h1>
          <p>Pilih produk sesuai kebutuhan cetak dan promosi Anda.</p>
        </div>

        <div className="catalog-toolbar">
          <input
            type="search"
            className="form-control"
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Cari produk"
          />

          <select
            className="form-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            aria-label="Filter kategori"
          >
            {categories.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <article className="product-card" key={product.id}>
              <div className="product-art product-blue">
                <span>▤</span>
                <small>DB DESIGN</small>
                <strong>{product.name.toUpperCase()}</strong>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <div className="product-card-bottom">
                  <strong>{formatPrice(product.price)}</strong>
                </div>
                <p className="catalog-note">
                  Harga contoh. Spesifikasi dan harga final akan dikonfirmasi.
                </p>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-catalog">
            Produk tidak ditemukan. Coba kata kunci lain.
          </div>
        )}
      </div>
    </section>
  );
}
