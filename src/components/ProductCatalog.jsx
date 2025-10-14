import React from 'react';
import './ProductCatalog.css';

const ProductCatalog = ({ products }) => {

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getProductIcon = (category) => {
    switch (category) {
      case 'Aspal':
        return '🛣️';
      case 'Beton':
        return '🏗️';
      case 'Agregat':
        return '🪨';
      default:
        return '📦';
    }
  };

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h3>Katalog Produk</h3>
        <p>Produk berkualitas tinggi untuk kebutuhan konstruksi Anda</p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-icon">
              {getProductIcon(product.category)}
            </div>
            
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
              
              <div className="product-pricing">
                <span className="product-price">{formatPrice(product.price)}</span>
                <span className="product-unit">/ {product.unit}</span>
              </div>
            </div>
            
            <div className="product-actions">
              <button className="btn-quote">
                Minta Penawaran
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="catalog-footer">
        <div className="contact-info">
          <h4>Butuh Konsultasi?</h4>
          <p>Hubungi tim kami untuk mendapatkan penawaran terbaik</p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+62 821-xxxx-xxxx</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>info@agungbeton.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;