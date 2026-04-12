// frontend/src/screens/ProductScreen.jsx

import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getPremiumImage } from '../utils/imageMap';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState({ reviews: [] });
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    addToCart({ ...product, qty: Number(qty) });
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingReview(true);
      setReviewError(null);
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      await axios.post(`/api/products/${productId}/reviews`, { rating, comment }, config);
      
      // Reload page to show new review
      window.location.reload();
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message);
      setLoadingReview(false);
    }
  };

  if (error) return <div className="container" style={{paddingTop: '50px'}}><div style={styles.errorBox}>{error}</div></div>;
  if (!product._id) return <div className="container" style={{paddingTop: '50px'}}><h2>Loading...</h2></div>;

  const resolvedImage = product.image ? product.image : getPremiumImage(product.name);

  return (
    <div className="container" style={styles.screenContainer}>
      <Link to="/" style={styles.backLink}>← Back to Shop</Link>
      
      {/* Top Section: Product Details - ADDED split-layout CLASS */}
      <div className="split-layout" style={styles.productLayout}>
        <div style={styles.imageSection} className="imageSection">
          <img src={resolvedImage} alt={product.name} style={styles.mainImage} />
        </div>

        <div style={styles.infoSection}>
          <p style={styles.brand}>{product.brand}</p>
          <h1 style={styles.title}>{product.name}</h1>
          
          <div style={styles.ratingStars}>
            {'⭐'.repeat(Math.round(product.rating || 0))} 
            <span style={{fontSize: '12px', color: 'var(--nexa-gray)', marginLeft: '8px'}}>
              ({product.numReviews} Reviews)
            </span>
          </div>

          <h2 style={styles.price}>₹{product.price}</h2>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.divider}></div>

          <div style={styles.statusRow}>
            <span style={styles.label}>Status:</span>
            <span style={{fontWeight: 'bold', color: product.countInStock > 0 ? '#059669' : '#dc2626'}}>
              {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
            </span>
          </div>

          {product.countInStock > 0 && (
            <div style={styles.statusRow}>
              <span style={styles.label}>Quantity:</span>
              <select style={styles.select} value={qty} onChange={(e) => setQty(e.target.value)}>
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="nexa-btn" 
            style={{width: '100%', marginTop: '30px', opacity: product.countInStock === 0 ? 0.5 : 1}}
            disabled={product.countInStock === 0} 
            onClick={addToCartHandler}
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Bottom Section: Reviews - ADDED split-layout CLASS */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>Customer Reviews</h2>
        
        <div className="split-layout" style={styles.reviewsLayout}>
          {/* Left: Existing Reviews */}
          <div style={{flex: 1.5}}>
            {product.reviews.length === 0 ? (
              <p style={{color: 'var(--nexa-gray)', fontStyle: 'italic'}}>No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {product.reviews.map((review) => (
                  <div key={review._id} style={styles.reviewCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                      <strong style={{fontSize: '14px'}}>{review.name}</strong>
                      <span style={{fontSize: '12px', color: 'var(--nexa-gray)'}}>{review.createdAt.substring(0, 10)}</span>
                    </div>
                    <div style={{marginBottom: '10px'}}>{'⭐'.repeat(review.rating)}</div>
                    <p style={{fontSize: '14px', lineHeight: '1.6'}}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Write a Review Form */}
          <div style={{flex: 1}}>
            <div style={styles.writeReviewBox}>
              <h3 style={{fontSize: '18px', marginBottom: '20px', fontWeight: '800'}}>Write a Review</h3>
              
              {reviewError && <div style={styles.errorBox}>{reviewError}</div>}
              
              {userInfo ? (
                <form onSubmit={submitReviewHandler} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <label style={styles.label}>Rating</label>
                    <select style={styles.select} value={rating} onChange={(e) => setRating(e.target.value)} required>
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <label style={styles.label}>Comment</label>
                    <textarea 
                      style={{...styles.select, height: '100px', resize: 'vertical'}} 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      placeholder="What did you think of this product?"
                      required
                    />
                  </div>
                  <button type="submit" className="nexa-btn" disabled={loadingReview}>
                    {loadingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p style={{fontSize: '14px', backgroundColor: '#e5e7eb', padding: '15px', borderRadius: '4px'}}>
                  Please <Link to="/login" style={{fontWeight: 'bold', color: 'var(--nexa-black)'}}>sign in</Link> to write a review.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { paddingTop: '40px', paddingBottom: '100px' },
  backLink: { display: 'inline-block', marginBottom: '30px', textDecoration: 'none', color: 'var(--nexa-gray)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' },
  productLayout: { display: 'flex', gap: '60px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '80px' },
  // FIXED: height is now 'auto' and minHeight is '300px'
  imageSection: { flex: '1.2', minWidth: '300px', backgroundColor: '#E8E6E1', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', overflow: 'hidden', height: 'auto', minHeight: '300px' },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' },
  infoSection: { flex: '1', minWidth: '300px', paddingTop: '20px' },
  brand: { fontSize: '12px', fontWeight: '800', color: 'var(--nexa-gray)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' },
  title: { fontSize: '36px', fontFamily: 'var(--font-main)', fontWeight: '800', lineHeight: 1.1, marginBottom: '15px', color: 'var(--nexa-black)' },
  ratingStars: { marginBottom: '20px', fontSize: '14px' },
  price: { fontSize: '24px', fontWeight: '500', marginBottom: '30px', color: 'var(--nexa-black)' },
  description: { fontSize: '15px', lineHeight: '1.7', color: 'var(--nexa-gray)', marginBottom: '30px' },
  divider: { height: '1px', backgroundColor: '#e0e0e0', margin: '30px 0' },
  statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '14px' },
  label: { fontWeight: '600', color: 'var(--nexa-black)' },
  select: { padding: '12px', border: '1px solid #D1CEC7', borderRadius: '4px', fontSize: '14px', outline: 'none', backgroundColor: 'transparent' },
  reviewsSection: { borderTop: '1px solid #e0e0e0', paddingTop: '60px' },
  reviewsTitle: { fontSize: '28px', fontWeight: '800', marginBottom: '40px', color: 'var(--nexa-black)' },
  reviewsLayout: { display: 'flex', gap: '60px', flexWrap: 'wrap' },
  reviewCard: { backgroundColor: 'var(--nexa-white)', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0' },
  writeReviewBox: { backgroundColor: '#F4F2ED', padding: '30px', borderRadius: 'var(--radius-md)' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }
};

export default ProductScreen;