// frontend/src/screens/PlaceOrderScreen.jsx

import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { getPremiumImage } from '../utils/imageMap';

const PlaceOrderScreen = () => {
  const { cartItems, clearCartItems, paymentMethod, shippingAddress } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);
  const [utr, setUtr] = useState(''); 
  const [isPlacing, setIsPlacing] = useState(false);

  // PROTECTION: Redirect if data is missing to prevent crashes
  useEffect(() => {
    if (!userInfo) navigate('/login');
    if (!shippingAddress || !shippingAddress.address) navigate('/checkout');
    if (cartItems.length === 0 && !isPlacing) navigate('/cart');
  }, [userInfo, shippingAddress, cartItems, navigate, isPlacing]);

  // CALCULATIONS
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 180;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // UPI CONFIG
  const upiId = 'devixl-shubham@fam'; 
  const merchantName = "NEXAStore";
  
  // DEEP LINKS - FIXED: Removed the undefined 'merchantUpiId' variable that was causing the crash
  const paytmURI = `paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${totalPrice}&cu=INR`;
  const phonepeURI = `phonepe://pay?pa=${upiId}&pn=${merchantName}&am=${totalPrice}&cu=INR`;
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=${merchantName}&am=${totalPrice}`;

  const placeOrderHandler = async () => {
    if (paymentMethod === 'BHIM UPI' && utr.trim().length < 12) {
      setError('Please enter a valid 12-digit UTR / Reference Number after paying.');
      return;
    }

    try {
      setIsPlacing(true);
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };

      const { data } = await axios.post('/api/orders', {
          orderItems: cartItems,
          shippingAddress: {
            address: shippingAddress.address, 
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone
          },
          paymentMethod,
          utrNumber: utr,
          itemsPrice, shippingPrice, taxPrice, totalPrice,
        }, config);

      clearCartItems();
      navigate(`/order/${data._id}`); 

    } catch (err) {
      setIsPlacing(false);
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };
  
  if (!shippingAddress || cartItems.length === 0 && !isPlacing) {
    return <div style={{padding: '100px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="container" style={styles.screenContainer}>
      {error && <div style={styles.errorBanner}>{error}</div>}
      
      <div style={styles.breadcrumbs}>
        <span style={styles.inactiveCrumb}>Bag</span> — <span style={styles.inactiveCrumb}>Shipping</span> — <span style={styles.inactiveCrumb}>Payment</span> — <span style={styles.activeCrumb}>Complete</span>
      </div>

      <div className="split-layout" style={styles.layout}>
        
        <div style={styles.detailsSection}>
          <h1 style={{fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '30px'}}>Review Your Order</h1>
          
          <div style={styles.infoBlock}>
            <h2 style={styles.sectionTitle}>Shipping Address</h2>
            <p style={styles.text}>{shippingAddress.address}</p>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.infoBlock}>
            <h2 style={styles.sectionTitle}>Payment Method</h2>
            <p style={styles.text}><strong>Selected:</strong> {paymentMethod}</p>

            {paymentMethod === 'BHIM UPI' && (
              <div style={styles.qrCodeBox}>
                <p style={styles.qrHeading}>Scan or Select App to Pay</p>
                <img src={qrCodeUrl} alt="UPI QR Code" style={{width: '150px', height: '150px', marginBottom: '15px'}} />
                <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>UPI ID: <strong>{upiId}</strong></p>
                
                <div style={styles.intentButtonGroup}>
                   <a href={paytmURI} style={styles.paytmBtn}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="" style={{height: '14px'}} />
                     Paytm
                   </a>
                   <a href={phonepeURI} style={styles.phonepeBtn}>
  <img 
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiE8cwVGeRCQjm7bgjlaoF57fIEOSWVKFRT5nMoF7fY-o6esq1ik7CNWX1W5IEYVa563dms2MnZCHGqM3Z5tcOSoYjwGiu&s&ec=121629557" 
    alt="PhonePe" 
    style={{ height: '22px', marginRight: '8px' }} 
  />
  PhonePe
</a>
                </div>
                <p style={{fontSize: '11px', color: '#888', marginTop: '10px'}}>*Redirect buttons work on mobile only.</p>

                <div style={{marginTop: '25px', width: '100%', maxWidth: '300px'}}>
                   <label style={styles.utrLabel}>Enter 12-Digit UTR / Ref Number *</label>
                   <input 
                      type="text" 
                      placeholder="e.g. 312345678901"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      style={styles.utrInput}
                      maxLength={12}
                   />
                </div>
              </div>
            )}
          </div>

          <div style={styles.divider}></div>

          <div style={styles.infoBlock}>
            <h2 style={styles.sectionTitle}>Items</h2>
            <div style={styles.itemList}>
              {cartItems.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <img src={item.image || getPremiumImage(item.name)} alt={item.name} style={styles.thumbnail} />
                  <div style={{flex: 1}}>
                    <Link to={`/product/${item._id}`} style={styles.itemName}>{item.name}</Link>
                    <p style={{fontSize: '13px', color: '#666', marginTop: '4px'}}>Qty: {item.qty}</p>
                  </div>
                  <div style={styles.itemCalculation}>
                    <strong>₹{item.qty * item.price}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryBox}>
            <h3 style={styles.summaryTitle}>Summary</h3>
            <div style={styles.summaryRow}><span>Items</span><span>₹{itemsPrice.toFixed(2)}</span></div>
            <div style={styles.summaryRow}><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span></div>
            <div style={styles.summaryRow}><span>Tax</span><span>₹{taxPrice.toFixed(2)}</span></div>
            <div style={styles.summaryDivider}></div>
            <div style={styles.summaryTotalRow}><span>Total</span><span>₹{totalPrice.toFixed(2)}</span></div>
            
            <button className="premium-btn" style={styles.placeOrderBtn} onClick={placeOrderHandler} disabled={isPlacing}>
              {isPlacing ? 'Processing...' : (paymentMethod === 'BHIM UPI' ? 'Submit UTR & Place Order' : 'Place Order')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '40px', paddingBottom: '100px' },
  breadcrumbs: { fontSize: '12px', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' },
  activeCrumb: { color: 'var(--text-dark)', fontWeight: 'bold' },
  inactiveCrumb: { color: '#bbb' },
  layout: { display: 'flex', gap: '80px', alignItems: 'flex-start' },
  detailsSection: { flex: '1.8', display: 'flex', flexDirection: 'column', gap: '20px' },
  infoBlock: { display: 'flex', flexDirection: 'column', gap: '15px' },
  sectionTitle: { fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', fontWeight: 'bold' },
  text: { fontSize: '16px', color: 'var(--text-dark)' },
  divider: { height: '1px', backgroundColor: '#eaeaea', margin: '15px 0' },
  itemList: { display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '10px' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  thumbnail: { width: '70px', height: '85px', objectFit: 'cover', borderRadius: '12px' },
  itemName: { textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 'bold', fontSize: '16px', fontFamily: 'var(--font-serif)' },
  itemCalculation: { fontSize: '16px', color: 'var(--text-dark)' },
  summarySection: { flex: '1', position: 'sticky', top: '40px' },
  summaryBox: { backgroundColor: '#f9f9f5', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
  summaryTitle: { fontSize: '20px', fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: '25px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '20px', color: 'var(--text-dark)' },
  summaryDivider: { height: '1px', backgroundColor: '#e0e0e0', margin: '25px 0' },
  summaryTotalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: '35px' },
  placeOrderBtn: { width: '100%', backgroundColor: '#222', color: '#fff', border: 'none', padding: '18px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' },
  qrCodeBox: { backgroundColor: '#f9f9f9', border: '1px dashed #ccc', padding: '30px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px', textAlign: 'center' },
  qrHeading: { fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' },
  errorBanner: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', marginBottom: '20px', borderRadius: '4px', textAlign: 'center' },
  intentButtonGroup: { display: 'flex', gap: '10px', width: '100%', maxWidth: '300px' },
  paytmBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#00baf2', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold' },
  phonepeBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#5f259f', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold' },
  utrLabel: { display: 'block', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', marginBottom: '8px', color: 'var(--text-dark)' },
  utrInput: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', outline: 'none' }
};

export default PlaceOrderScreen;