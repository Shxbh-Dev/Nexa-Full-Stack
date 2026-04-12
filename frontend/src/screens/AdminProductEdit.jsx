// frontend/src/screens/AdminProductEdit.jsx

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchProduct();
  }, [productId, navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      
      await axios.put(`/api/products/${productId}`, {
        name, price, image, brand, category, countInStock, description
      }, config);
      
      alert('Product updated successfully!');
      navigate('/admin/products'); // Send them back to the inventory list
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <Link to="/admin/products" style={styles.backLink}>← Go Back to Inventory</Link>
      
      <div style={styles.formWrapper}>
        <h1 style={styles.pageTitle}>Edit Product</h1>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submitHandler} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Name</label>
            <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Price (₹)</label>
              <input type="number" step="0.01" style={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Stock Count</label>
              <input type="number" style={styles.input} value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL (Unsplash/Web Link)</label>
            <input type="text" style={styles.input} value={image} onChange={(e) => setImage(e.target.value)} required />
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Brand</label>
              <input type="text" style={styles.input} value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Category</label>
              <input type="text" style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea style={{...styles.input, height: '120px', resize: 'vertical'}} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <button type="submit" className="nexa-btn" style={styles.submitBtn} disabled={loadingUpdate}>
            {loadingUpdate ? 'Saving...' : 'Save Product Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '40px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  backLink: { alignSelf: 'flex-start', marginBottom: '20px', textDecoration: 'none', color: 'var(--nexa-gray)', fontWeight: '600', fontSize: '14px' },
  formWrapper: { width: '100%', maxWidth: '700px', backgroundColor: 'var(--nexa-white)', padding: '50px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)' },
  pageTitle: { fontSize: '28px', fontFamily: 'var(--font-main)', fontWeight: '800', marginBottom: '30px', color: 'var(--nexa-black)' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'flex', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: 'var(--nexa-black)', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '15px', border: '1px solid #D1CEC7', borderRadius: '4px', fontSize: '14px', backgroundColor: 'transparent', outline: 'none', transition: 'border-color 0.3s' },
  submitBtn: { marginTop: '20px', width: '100%' }
};

export default AdminProductEdit;