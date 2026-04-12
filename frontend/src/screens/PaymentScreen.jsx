import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const PaymentScreen = () => {
  const { shippingAddress, savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  // Default to UPI for the intent buttons
  const [paymentMethod, setPaymentMethod] = useState('BHIM UPI');

  useEffect(() => {
    // If no address, kick them back to shipping
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/checkout');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="container" style={{paddingTop: '60px', paddingBottom: '100px'}}>
      <div style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 style={{fontFamily: 'var(--font-serif)', marginBottom: '40px', textAlign: 'center'}}>Select Payment Method</h2>
        
        <form onSubmit={submitHandler}>
          <div style={styles.optionCard}>
            <input 
              type="radio" 
              id="UPI" 
              name="paymentMethod" 
              value="BHIM UPI" 
              checked={paymentMethod === 'BHIM UPI'} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
            />
            <label htmlFor="UPI" style={styles.label}>
              <strong>BHIM UPI</strong>
              <span style={styles.subLabel}>Pay via Paytm, PhonePe, or Google Pay</span>
            </label>
          </div>

          <div style={styles.optionCard}>
            <input 
              type="radio" 
              id="COD" 
              name="paymentMethod" 
              value="COD" 
              checked={paymentMethod === 'COD'} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
            />
            <label htmlFor="COD" style={styles.label}>
              <strong>Cash on Delivery (COD)</strong>
              <span style={styles.subLabel}>Pay when your order arrives</span>
            </label>
          </div>

          <button type="submit" className="premium-btn" style={styles.submitBtn}>
            Continue to Review
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  optionCard: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '15px',
    cursor: 'pointer'
  },
  label: { marginLeft: '15px', cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  subLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
  submitBtn: { width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }
};

export default PaymentScreen;