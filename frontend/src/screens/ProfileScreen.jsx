// frontend/src/screens/ProfileScreen.jsx

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);

      // Fetch user's order history
      const fetchMyOrders = async () => {
        try {
          const config = { withCredentials: true };
          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data);
          setLoadingOrders(false);
        } catch (error) {
          console.error('Error fetching orders', error);
          setLoadingOrders(false);
        }
      };

      fetchMyOrders();
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        // Note: Assuming you have a PUT route to update the profile
        await axios.put('/api/users/profile', { name, email, password }, config);
        setSuccess(true);
        setMessage('Profile Updated Successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      }
    }
  };

  const cancelOrderHandler = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        await axios.delete(`/api/orders/${id}`, config);
        // Remove the order from the UI instantly
        setOrders(orders.filter((order) => order._id !== id));
        alert('Order successfully cancelled.');
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <h1 style={styles.pageTitle}>My Account</h1>

      <div className="split-layout" style={styles.layout}>
        
        {/* Left Side: Update Profile Form */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Update Profile</h2>
          
          {message && (
            <div style={success ? styles.successBox : styles.errorBox}>
              {message}
            </div>
          )}

          <form onSubmit={submitHandler} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input type="password" style={styles.input} placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input type="password" style={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <button type="submit" className="nexa-btn" style={{marginTop: '10px'}}>
              Update Details
            </button>
          </form>
        </div>

        {/* Right Side: Order History */}
        <div style={styles.ordersSection}>
          <h2 style={styles.sectionTitle}>My Orders</h2>

          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>You haven't placed any orders yet.</p>
              <Link to="/" style={{color: 'var(--nexa-black)', fontWeight: 'bold'}}>Start Shopping</Link>
            </div>
          ) : (
            <div className="tableContainer" style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>DATE</th>
                    <th style={styles.th}>TOTAL</th>
                    <th style={styles.th}>PAID</th>
                    <th style={styles.th}>DELIVERED</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={styles.tr}>
                      <td style={styles.td}>{order._id.substring(18, 24)}</td>
                      <td style={styles.td}>{order.createdAt.substring(0, 10)}</td>
                      <td style={styles.td}>₹{order.totalPrice.toFixed(2)}</td>
                      <td style={styles.td}>
                        {order.isPaid ? <span style={styles.statusPaid}>Yes</span> : <span style={styles.statusPending}>No</span>}
                      </td>
                      <td style={styles.td}>
                        {order.isDelivered ? <span style={styles.statusPaid}>Yes</span> : <span style={styles.statusPending}>No</span>}
                      </td>
                      
                      {/* FIXED: Added the Cancel button next to Details */}
                      <td style={{...styles.td, display: 'flex', gap: '10px'}}>
                        <Link to={`/order/${order._id}`} style={styles.detailsBtn}>Details</Link>
                        
                        {!order.isDelivered && (
                          <button 
                            onClick={() => cancelOrderHandler(order._id)} 
                            style={{...styles.detailsBtn, color: '#dc2626', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', cursor: 'pointer'}}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '60px', paddingBottom: '100px' },
  pageTitle: { fontSize: '32px', fontFamily: 'var(--font-main)', fontWeight: '800', marginBottom: '40px', color: 'var(--nexa-black)' },
  layout: { display: 'flex', gap: '60px', alignItems: 'flex-start' },
  formSection: { flex: '1', backgroundColor: '#F4F2ED', padding: '30px', borderRadius: 'var(--radius-md)' },
  ordersSection: { flex: '2' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '25px', color: 'var(--nexa-black)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: 'var(--nexa-gray)', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '12px', border: '1px solid #D1CEC7', borderRadius: '4px', fontSize: '14px', backgroundColor: 'var(--nexa-white)', outline: 'none' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' },
  successBox: { backgroundColor: '#d1fae5', color: '#065f46', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' },
  emptyBox: { backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', padding: '40px', textAlign: 'center', borderRadius: '4px' },
  tableWrapper: { backgroundColor: 'var(--nexa-white)', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '15px', borderBottom: '2px solid var(--nexa-black)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nexa-gray)', backgroundColor: '#f9fafb' },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background-color 0.2s' },
  td: { padding: '15px', fontSize: '14px', color: 'var(--nexa-black)' },
  statusPaid: { backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  statusPending: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  detailsBtn: { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 15px', textDecoration: 'none', color: '#374151', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
};

export default ProfileScreen;