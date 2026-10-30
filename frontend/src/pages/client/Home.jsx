
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

const products = [
  {
    name: 'Banner',
    category: 'Promosi',
    price: 'Rp 50.000',
    symbol: '▤',
    color: 'blue',
    description: 'Cocok untuk promosi, event, dan kebutuhan bisnis.'
  },
  {
    name: 'Brosur',
    category: 'Media Cetak',
    price: 'Rp 100.000',
    symbol: '▧',
    color: 'orange',
    description: 'Media promosi efektif dengan desain menarik.'
  },
  {
    name: 'Kartu Nama',
    category: 'Identitas Bisnis',
    price: 'Rp 75.000',
    symbol: '▱',
    color: 'dark',
    description: 'Tampilkan identitas profesional bisnis Anda.'
  },
  {
    name: 'Stiker',
    category: 'Label',
    price: 'Rp 25.000',
    symbol: '◉',
    color: 'purple',
    description: 'Untuk label produk, kemasan, dan branding.'
  }
];

export default function Home() {
  return (
    <>
      <section className="client-hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-tag">SOLUSI CETAK & DESAIN</span>
            <h1>Ide Anda, Kami Wujudkan.</h1>
            <p>
              Cetak kebutuhan bisnis dan promosi dengan mudah.
              Pilih produk, sesuaikan kebutuhan, dan pesan secara praktis.
            </p>
            <div className="hero-actions">
              <Link to="/produk" className="btn-client-primary">
                Lihat Produk <span>→</span>
              </Link>
              <a href="#tentang" className="btn-client-outline">
                Tentang Kami
              </a>
            </div>
            <div className="hero-note">
              ✓ Pilihan produk beragam
              <span>✓ Pemesanan praktis</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Ilustrasi produk cetak">
            <div className="art-circle" />
            <div className="print-sheet sheet-back">DB<br />DESIGN</div>
            <div className="print-sheet sheet-front">
              <span>YOUR IDEAS</span>
              <strong>OUR PRINT</strong>
              <small>DESIGN · PRINT · CREATE</small>
            </div>
            <div className="art-label">CREATE SOMETHING GREAT</div>
          </div>
        </div>
      </section>

      <section className="client-benefits">
        <div className="container benefit-grid">
          <div><span>✦</span><div><b>Kualitas Terjaga</b><small>Fokus pada hasil cetak</small></div></div>
          <div><span>◷</span><div><b>Proses Praktis</b><small>Pemesanan lebih mudah</small></div></div>
          <div><span>◇</span><div><b>Pilihan Beragam</b><small>Untuk berbagai kebutuhan</small></div></div>
          <div><span>♡</span><div><b>Layanan Profesional</b><small>Siap membantu Anda</small></div></div>
        </div>
      </section>

      <section className="client-products" id="produk-unggulan">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">PILIHAN UNTUK ANDA</span>
              <h2>Produk Populer</h2>
              <p>Temukan produk cetak untuk bisnis, acara, dan kebutuhan pribadi.</p>
            </div>
            <Link to="/produk" className="see-all">Lihat Semua →</Link>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <div className={`product-art product-${product.color}`}>
                  <span>{product.symbol}</span>
                  <small>DB DESIGN</small>
                  <strong>{product.name.toUpperCase()}</strong>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-card-bottom">
                    <strong>{product.price}</strong>
                    <Link
                      to="/produk"
                      className="product-order"
                      aria-label={`Lihat ${product.name}`}
                    >
                      Lihat Produk →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="client-cta" id="tentang">
        <div className="container cta-inner">
          <div>
            <span className="section-eyebrow">MULAI SEKARANG</span>
            <h2>Punya kebutuhan cetak?</h2>
            <p>Jelajahi pilihan produk dan temukan yang sesuai dengan kebutuhan Anda.</p>
          </div>
          <Link to="/produk" className="btn-client-primary">
            Jelajahi Produk →
          </Link>
        </div>
      </section>
    </>
  );
}
