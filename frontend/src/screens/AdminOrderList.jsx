// frontend/src/screens/AdminOrderList.jsx

import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const { data } = await axios.get('/api/orders', config);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  // NEW: Delete Order Handler for Admins
  const deleteHandler = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to completely delete this order?')) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        await axios.delete(`/api/orders/${id}`, config);
        // Refresh the list by filtering out the deleted order
        setOrders(orders.filter((order) => order._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <div style={styles.headerRow}>
        <h1 style={styles.pageTitle}>Order Management</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ORDER ID</th>
              <th style={styles.th}>USER</th>
              <th style={styles.th}>DATE</th>
              <th style={styles.th}>TOTAL</th>
              <th style={styles.th}>PAID</th>
              <th style={styles.th}>DELIVERED</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={styles.tr}>
                <td style={styles.td}>{order._id.substring(18, 24)}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>{order.user ? order.user.name : 'Deleted User'}</td>
                <td style={styles.td}>{order.createdAt.substring(0, 10)}</td>
                <td style={styles.td}>₹{order.totalPrice.toFixed(2)}</td>
                <td style={styles.td}>
                  {order.isPaid ? (
                    <span style={styles.statusPaid}>{order.paidAt.substring(0, 10)}</span>
                  ) : (
                    <span style={styles.statusPending}>Pending</span>
                  )}
                </td>
                <td style={styles.td}>
                  {order.isDelivered ? (
                    <span style={styles.statusPaid}>{order.deliveredAt.substring(0, 10)}</span>
                  ) : (
                    <span style={styles.statusPending}>No</span>
                  )}
                </td>
                
                {/* FIXED: Added the Delete button next to Details */}
                <td style={{...styles.td, display: 'flex', gap: '10px'}}>
                  <Link to={`/order/${order._id}`} style={styles.detailsBtn}>Details</Link>
                  <button 
                    onClick={() => deleteHandler(order._id)}
                    style={{...styles.detailsBtn, backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer'}}
                  >
                    Delete
                  </button>
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
  statusPaid: { backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  statusPending: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  detailsBtn: { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 15px', textDecoration: 'none', color: '#374151', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s', display: 'inline-block' },
};

export default AdminOrderList;