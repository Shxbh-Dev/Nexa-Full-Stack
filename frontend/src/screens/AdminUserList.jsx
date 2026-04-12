// frontend/src/screens/AdminUserList.jsx

import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const { data } = await axios.get('/api/users', config);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchUsers();
  }, [userInfo, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to completely delete this user? This cannot be undone.')) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        await axios.delete(`/api/users/${id}`, config);
        
        setUsers(users.filter((user) => user._id !== id));
        alert('User successfully deleted.');
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <div style={styles.headerRow}>
        <h1 style={styles.pageTitle}>User Management</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div className="tableContainer" style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>NAME</th>
              <th style={styles.th}>EMAIL</th>
              <th style={styles.th}>ADMIN</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={styles.tr}>
                <td style={styles.td}>{user._id.substring(18, 24)}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>{user.name}</td>
                <td style={styles.td}><a href={`mailto:${user.email}`} style={{color: 'var(--nexa-black)'}}>{user.email}</a></td>
                <td style={styles.td}>
                  {user.isAdmin ? (
                    <span style={styles.statusAdmin}>Yes</span>
                  ) : (
                    <span style={styles.statusCustomer}>No</span>
                  )}
                </td>
                <td style={{...styles.td, display: 'flex', gap: '10px'}}>
                  {!user.isAdmin && (
                    <button 
                      onClick={() => deleteHandler(user._id)}
                      style={{...styles.detailsBtn, backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer'}}
                    >
                      Delete
                    </button>
                  )}
                  {user.isAdmin && <span style={{fontSize: '12px', color: '#888', fontStyle: 'italic'}}>Protected</span>}
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
  statusAdmin: { backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  statusCustomer: { backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  detailsBtn: { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 15px', textDecoration: 'none', color: '#374151', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s', display: 'inline-block' },
};

export default AdminUserList;