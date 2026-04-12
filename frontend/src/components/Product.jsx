// frontend/src/components/Product.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getPremiumImage } from '../utils/imageMap';

const Product = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const resolvedImage = product.image ? product.image : getPremiumImage(product.name);

  return (
    <div className="product-card" style={styles.card}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={styles.imageContainer}>
          <img src={resolvedImage} alt={product.name} style={styles.image} />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.price}>₹{product.price}</p>
        </div>
      </Link>
      
      <button 
        onClick={() => addToCart(product, 1)} 
        style={styles.addBtn}
      >
        + Add to Bag
      </button>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '17px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #eee',
    height: '100%',
    boxSizing: 'border-box'
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    borderRadius: '12px',
    marginBottom: '12px',
    backgroundColor: '#f9f9f9'
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { flexGrow: 1, marginBottom: '10px' },
  name: { fontSize: '15px', fontWeight: 'bold', margin: '0 0 5px 0', fontFamily: 'var(--font-serif)' },
  price: { fontSize: '14px', color: '#666', margin: 0 },
  addBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};

export default Product;