// frontend/src/screens/CartScreen.jsx

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getPremiumImage } from '../utils/imageMap';

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 180; 
  const tax = subtotal * 0.08; 
  const total = subtotal + shipping + tax;

  return (
    <div className="container" style={styles.screenContainer}>
      <h2 style={styles.pageTitle}>Your Shopping Bag <span style={{color: '#888', fontSize: '18px'}}>({totalItems} Items)</span></h2>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p style={{fontSize: '18px', color: '#666'}}>Your bag is currently empty.</p>
          <Link to="/" className="premium-btn" style={styles.continueBtn}>Discover the Collection</Link>
        </div>
      ) : (
        /* FIXED: Added "split-layout" class for perfect mobile stacking */
        <div className="split-layout" style={styles.layout}>
          
          <div style={styles.cartItemsSection}>
            <div style={styles.tableHeader}>
              <span style={{ flex: 2 }}>Product</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Quantity</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
            </div>
            <div style={styles.divider}></div>

            {cartItems.map((item) => {
              // FIXED: Smart Image Resolver for the Cart!
              const resolvedImage = item.image ? item.image : getPremiumImage(item.name);

              return (
                <div key={item._id} style={styles.cartRow}>
                  <div style={styles.productCol}>
                    <img src={resolvedImage} alt={item.name} style={styles.cartThumbnail} />
                    <div>
                      <Link to={`/product/${item._id}`} className="nav-link" style={styles.productNameLink}>
                        {item.name}
                      </Link>
                      <p style={styles.productPrice}>₹{item.price}</p>
                      <span style={styles.removeText} onClick={() => removeFromCart(item._id)}>Remove</span>
                    </div>
                  </div>

                  <div style={styles.qtyCol}>
                    <div style={styles.qtyBox}>
                      <span style={styles.qtyBtn} onClick={() => item.qty > 1 && addToCart({ ...item, qty: item.qty - 1 })}>-</span>
                      <span style={{fontWeight: 'bold'}}>{item.qty}</span>
                      <span style={styles.qtyBtn} onClick={() => item.qty < item.countInStock && addToCart({ ...item, qty: item.qty + 1 })}>+</span>
                    </div>
                  </div>

                  <div style={styles.subtotalCol}>₹{(item.price * item.qty).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          <div style={styles.summarySection}>
            <div style={styles.summaryBox}>
              <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '20px'}}>Order Summary</h3>
              <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div style={styles.summaryRow}><span>Estimated Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
              <div style={styles.summaryRow}><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
              <div style={styles.summaryDivider}></div>
              <div style={styles.summaryTotalRow}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <button className="premium-btn" style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '60px', paddingBottom: '100px' }, pageTitle: { fontSize: '36px', fontFamily: 'var(--font-serif)', marginBottom: '50px', color: 'var(--text-dark)' }, emptyCart: { padding: '80px 0', textAlign: 'center', backgroundColor: '#f9f9f5', borderRadius: '4px' }, continueBtn: { display: 'inline-block', marginTop: '30px', backgroundColor: '#222', color: '#fff', padding: '15px 40px', borderRadius: '30px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', fontWeight: 'bold' }, layout: { display: 'flex', gap: '60px', alignItems: 'flex-start' }, cartItemsSection: { flex: '2' }, tableHeader: { display: 'flex', fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', paddingBottom: '15px', letterSpacing: '1px' }, divider: { height: '1px', backgroundColor: '#e0e0e0', marginBottom: '30px' }, cartRow: { display: 'flex', alignItems: 'center', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #f0f0f0' }, productCol: { flex: 2, display: 'flex', alignItems: 'center', gap: '25px' }, cartThumbnail: { width: '100px', height: '120px', objectFit: 'cover', borderRadius: '2px' }, productNameLink: { textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 'bold', fontSize: '16px', fontFamily: 'var(--font-serif)' }, productPrice: { fontSize: '14px', color: '#666', marginTop: '8px', marginBottom: '12px' }, qtyCol: { flex: 1, display: 'flex', justifyContent: 'center' }, qtyBox: { border: '1px solid #ccc', display: 'flex', alignItems: 'center', gap: '20px', padding: '8px 15px', borderRadius: '30px', userSelect: 'none' }, qtyBtn: { cursor: 'pointer', fontSize: '18px' }, subtotalCol: { flex: 1, textAlign: 'right', fontSize: '16px', fontWeight: 'bold' }, removeText: { fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }, summarySection: { flex: '1', position: 'sticky', top: '40px' }, summaryBox: { backgroundColor: '#f9f9f5', padding: '40px', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }, summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '20px', color: 'var(--text-dark)' }, summaryDivider: { height: '1px', backgroundColor: '#e0e0e0', margin: '25px 0' }, summaryTotalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: '35px', color: 'var(--text-dark)' }, checkoutBtn: { width: '100%', backgroundColor: '#222', color: '#fff', border: 'none', padding: '18px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }
};

export default CartScreen;