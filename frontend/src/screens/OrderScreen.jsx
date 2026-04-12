// frontend/src/screens/OrderScreen.jsx

import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { getPremiumImage } from '../utils/imageMap'; 

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    
    fetchOrder();
  }, [orderId, userInfo, navigate]);

  const toggleStatusHandler = async (type, currentValue) => {
    try {
      setLoadingStatus(true);
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const payload = type === 'paid' ? { isPaid: !currentValue } : { isDelivered: !currentValue };
      await axios.put(`/api/orders/${orderId}/admin-status`, payload, config);
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      setLoadingStatus(false);
    }
  };

  // SAFETY CHECK: Prevents the "Blank Page" crash by waiting for data
  if (error) return <div className="container" style={styles.screenContainer}><div style={styles.errorBox}>{error}</div></div>;
  if (!order) return <div className="container" style={styles.screenContainer}><h2 style={styles.pageTitle}>Loading Order...</h2></div>;

  // UPI DEEP LINKING
  const upiId = "devixl-shubham@fam"; 
  const merchantName = "NEXA%20Store"; 
  const orderAmount = order?.totalPrice?.toFixed(2);
  
  const paytmURI = `paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${orderAmount}&cu=INR`;
  const phonepeURI = `phonepe://pay?pa=${upiId}&pn=${merchantName}&am=${orderAmount}&cu=INR`;

  const isUpi = order.paymentMethod?.toUpperCase().includes('UPI');

  return (
    <div className="container" style={styles.screenContainer}>
      <Link to="/profile" style={styles.backLink}>← Back to Profile</Link>
      
      <h1 style={styles.pageTitle}>Order <span style={{color: 'var(--nexa-gray)', fontSize: '20px'}}>#{order._id}</span></h1>

      <div className="split-layout" style={styles.layout}>
        <div style={styles.detailsSection}>
          
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Shipping Information</h2>
            <p style={styles.text}><strong>Name: </strong> {order.user?.name}</p>
            <p style={styles.text}><strong>Address: </strong> {order.shippingAddress?.address}</p>
            {order.isDelivered ? (
              <div style={styles.successBox}>Delivered on {order.deliveredAt?.substring(0, 10)}</div>
            ) : (
              <div style={styles.warningBox}>Not Delivered</div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment Status</h2>
            <p style={styles.text}><strong>Method: </strong> {order.paymentMethod}</p>
            
            {order.isPaid ? (
              <div style={styles.successBox}>Paid on {order.paidAt?.substring(0, 10)}</div>
            ) : isUpi ? (
              <div style={styles.pendingBox}>Verification Pending (UTR Check)</div>
            ) : (
              <div style={styles.warningBox}>Not Paid</div>
            )}

            {/* UPI INTENT BUTTONS */}
            {!order.isPaid && isUpi && (
              <div style={styles.upiContainer}>
                <p style={styles.upiText}>Quick Pay via App:</p>
                <div style={styles.paymentButtonGroup}>
                   <a href={paytmURI} style={styles.paytmBtn}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="" style={{height: '14px'}} />
                     Paytm
                   </a>
                   <a href={phonepeURI} style={styles.phonepeBtn}>
  <img 
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR79y2ZF7SzZ6HaMg0I9m4p_bgwKJMcSCSimOCzHwjRtsoE_shBO-PG_WsPdF3-oEafCcJmy8Tejqe2_3VQQjtHF4ObKAeW&s&ec=121629557" 
    alt="PhonePe" 
    style={{ height: '22px', marginRight: '8px' }} 
  />
  PhonePe
</a>
                </div>
                <p style={styles.desktopWarning}>*App redirect works on Mobile only.</p>
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Order Items</h2>
            <div style={styles.itemsList}>
              {order.orderItems.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <div style={styles.imgContainer}>
                    <img src={item.image || getPremiumImage(item.name)} alt={item.name} style={styles.itemImg} />
                  </div>
                  <span style={styles.itemName}>{item.name}</span>
                  <div style={styles.itemPrice}>{item.qty} x ₹{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryBox}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}><span>Items</span><span>₹{order.itemsPrice?.toFixed(2)}</span></div>
            <div style={styles.summaryTotalRow}><span>Total</span><span>₹{order.totalPrice?.toFixed(2)}</span></div>
            
            {userInfo?.isAdmin && (
              <div style={styles.adminBox}>
                <button 
                  onClick={() => toggleStatusHandler('paid', order.isPaid)} 
                  style={order.isPaid ? styles.revokeBtn : styles.approveBtn}
                  disabled={loadingStatus}
                >
                  {order.isPaid ? 'Revoke Payment' : 'Mark as Paid'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '40px', paddingBottom: '100px' },
  backLink: { display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#888', fontWeight: '600', fontSize: '13px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', marginBottom: '40px' },
  layout: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  detailsSection: { flex: '2', minWidth: '300px' },
  section: { marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #eee' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '15px' },
  text: { fontSize: '14px', marginBottom: '8px' },
  successBox: { backgroundColor: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  warningBox: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  pendingBox: { backgroundColor: '#fef3c7', color: '#92400e', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '15px' },
  imgContainer: { width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' },
  itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
  itemName: { flex: 1, fontSize: '14px', fontWeight: '600' },
  itemPrice: { fontSize: '14px', color: '#888' },
  summarySection: { flex: '1', minWidth: '300px' },
  summaryBox: { backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '12px', border: '1px solid #eee' },
  summaryTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '20px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '15px' },
  summaryTotalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', marginTop: '20px' },
  adminBox: { marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #ccc' },
  approveBtn: { width: '100%', padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  revokeBtn: { width: '100%', padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  upiContainer: { marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee' },
  upiText: { fontSize: '13px', fontWeight: 'bold', marginBottom: '15px' },
  paymentButtonGroup: { display: 'flex', gap: '10px' },
  paytmBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#00baf2', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' },
  phonepeBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5f259f', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' },
  desktopWarning: { fontSize: '11px', color: '#888', marginTop: '10px' }
};

export default OrderScreen;