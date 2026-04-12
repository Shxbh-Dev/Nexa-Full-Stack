// frontend/src/screens/CheckoutScreen.jsx

import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { getPremiumImage } from '../utils/imageMap';

const CheckoutScreen = () => {
  const { cartItems, shippingAddress, saveShippingAddress } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [email, setEmail] = useState(shippingAddress?.email || userInfo?.email || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  const [name, setName] = useState(shippingAddress?.name || userInfo?.name || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  
  const [password, setPassword] = useState(''); 
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08; 
  const total = subtotal + tax; 

  const submitHandler = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    // 1. FRICTIONLESS REGISTRATION LOGIC
    if (!userInfo) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('/api/users', { name, email, password }, config);
        
        // Save the new user to local storage
        localStorage.setItem('userInfo', JSON.stringify(data));
        
      } catch (err) {
        setAuthError(err.response?.data?.message || 'Registration failed. Email might be in use.');
        setLoading(false);
        return; 
      }
    }

    // 2. Save the shipping details
    saveShippingAddress({ email, phone, name, address });
    
    // 3. FIXED: Redirect to /payment instead of /placeorder
    if (!userInfo) {
      // Force reload for new users so AuthContext updates
      window.location.href = '/payment'; 
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      
      <div style={styles.breadcrumbs}>
        <Link to="/cart" style={styles.crumbLink}>Bag</Link> → 
        <span style={styles.activeCrumb}> Shipping </span> → 
        <span style={styles.inactiveCrumb}>Payment</span> → 
        <span style={styles.inactiveCrumb}>Complete</span>
      </div>

      <div className="split-layout" style={styles.layout}>
        
        <div style={styles.formSection}>
          <h2 style={styles.pageTitle}>
            {userInfo ? 'Shipping Information' : 'Guest Checkout & Registration'}
          </h2>
          
          {authError && <div style={styles.errorBox}>{authError}</div>}

          <form onSubmit={submitHandler} style={styles.form}>
            
            {!userInfo && (
               <div style={styles.guestAlert}>
                 <p>You are checking out as a new customer. We will create an account for you so you can track your order.</p>
               </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Full Name</label>
                <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Phone Number</label>
                <input type="text" style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Shipping Address</label>
              <input type="text" style={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            {!userInfo && (
              <div style={{...styles.inputGroup, marginTop: '10px', backgroundColor: '#f9f9f5', padding: '15px', border: '1px dashed #ccc', borderRadius: '4px'}}>
                <label style={styles.label}>Create an Account Password *</label>
                <input 
                  type="password" 
                  style={{...styles.input, backgroundColor: '#fff'}} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required 
                />
              </div>
            )}

            <button type="submit" className="premium-btn" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryBox}>
            <h3 style={styles.summaryTitle}>Order summary</h3>
            
            <div style={styles.summaryItems}>
              {cartItems.map((item) => {
                const resolvedImage = item.image ? item.image : getPremiumImage(item.name);
                return (
                  <div key={item._id} style={styles.miniItemRow}>
                    <div style={styles.miniThumbnail}>
                       <img src={resolvedImage} alt={item.name} style={styles.miniImage} />
                    </div>
                    <div style={styles.miniItemDetails}>
                      <p style={styles.miniItemName}>{item.name}</p>
                      <p style={styles.miniItemPrice}>₹{item.price} x {item.qty}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.summaryDivider}></div>
            <div style={styles.summaryRow}><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
            <div style={styles.summaryTotalRow}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '40px', paddingBottom: '100px' },
  breadcrumbs: { fontSize: '12px', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' },
  crumbLink: { textDecoration: 'none', color: '#bbb' },
  activeCrumb: { color: 'var(--text-dark)', fontWeight: 'bold' },
  inactiveCrumb: { color: '#bbb' },
  layout: { display: 'flex', gap: '60px', alignItems: 'flex-start' },
  formSection: { flex: '1.5' },
  pageTitle: { fontSize: '22px', fontFamily: 'var(--font-serif)', marginBottom: '30px', color: 'var(--text-dark)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'flex', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', backgroundColor: 'transparent', outline: 'none' },
  guestAlert: { backgroundColor: '#e0f2fe', color: '#0284c7', padding: '12px 15px', borderRadius: '4px', fontSize: '13px', borderLeft: '4px solid #0284c7' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' },
  submitBtn: { marginTop: '20px', alignSelf: 'flex-start', backgroundColor: '#222', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' },
  summarySection: { flex: '1' },
  summaryBox: { backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '4px', border: '1px solid #e0e0e0' },
  summaryTitle: { fontSize: '16px', fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-dark)' },
  summaryItems: { display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto' },
  miniItemRow: { display: 'flex', gap: '15px', alignItems: 'center' },
  miniThumbnail: { width: '50px', height: '50px', backgroundColor: '#e6e3da', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '2px' },
  miniImage: { width: '100%', height: '100%', objectFit: 'cover' },
  miniItemDetails: { display: 'flex', flexDirection: 'column', gap: '4px' },
  miniItemName: { fontSize: '13px', fontWeight: 'bold', color: 'var(--text-dark)', fontFamily: 'var(--font-serif)' },
  miniItemPrice: { fontSize: '12px', color: '#888' },
  summaryDivider: { height: '1px', backgroundColor: '#e0e0e0', margin: '20px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '15px', color: 'var(--text-dark)' },
  summaryTotalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: '30px', color: 'var(--text-dark)' },
};

export default CheckoutScreen;