// frontend/src/screens/AdminProductList.jsx

import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // FIXED: Added Link right here!
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [userInfo, navigate]);

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts(); 
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      setLoading(true);
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      await axios.post('/api/products', {}, config); 
      fetchProducts(); 
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <div style={styles.headerRow}>
        <h1 style={styles.pageTitle}>Inventory Management</h1>
        <button className="nexa-btn" onClick={createProductHandler} disabled={loading}>
          {loading ? 'Creating...' : '+ Create Product'}
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>NAME</th>
              <th style={styles.th}>PRICE</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>STOCK</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={styles.tr}>
                <td style={styles.td}>{product._id.substring(18, 24)}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>{product.name}</td>
                <td style={styles.td}>₹{product.price}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>
                  {product.countInStock > 0 ? (
                    <span style={styles.inStock}>{product.countInStock}</span>
                  ) : (
                    <span style={styles.outOfStock}>0</span>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* The Link tag that was breaking the page is now supported! */}
                    <Link to={`/admin/product/${product._id}/edit`} style={{...styles.editBtn, textDecoration: 'none'}}>Edit</Link>
                    <button style={styles.deleteBtn} onClick={() => deleteHandler(product._id, product.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '60px', paddingBottom: '100px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  pageTitle: { fontSize: '28px', fontFamily: 'var(--font-main)', fontWeight: '800', color: 'var(--nexa-black)' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' },
  tableContainer: { backgroundColor: 'var(--nexa-white)', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', overflowX: 'auto', boxShadow: 'var(--shadow-soft)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '15px', borderBottom: '2px solid var(--nexa-black)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nexa-gray)' },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background-color 0.2s' },
  td: { padding: '20px 15px', fontSize: '14px', color: 'var(--nexa-black)' },
  inStock: { backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  outOfStock: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  editBtn: { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 15px', color: '#374151', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block' },
  deleteBtn: { backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '6px 15px', color: '#991b1b', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
};

export default AdminProductList;