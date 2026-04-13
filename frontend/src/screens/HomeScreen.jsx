// frontend/src/screens/HomeScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Product from '../components/Product';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      const url = searchKeyword ? `/api/products?keyword=${searchKeyword}` : '/api/products';
      const { data } = await axiosInstance.get(url); // <-- Use the 'url' variable here!
      setProducts(data);
    };
    fetchProducts();
  }, [searchKeyword]);

  // NEW: Smooth scroll function for our buttons
  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* 1. HERO SECTION */}
      <div className="container hero-layout" style={styles.heroSection}>
        <div className="hero-left" style={styles.heroLeft}>
          <h1 className="hero-title" style={styles.heroTitle}>THE FUTURE OF<br/>EVERYDAY.</h1>
          <p style={styles.heroSubtitle}>Clean Design. Better Choices.<br/>Made for NewGen.</p>
          
          {/* FIXED: Button now smoothly scrolls to the shop section */}
          <button className="nexa-btn" onClick={scrollToShop}>
            Shop New Arrivals
          </button>
        </div>
        <div className="hero-right" style={styles.heroRight}>
          <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800" alt="Nexa Headphones" style={styles.heroImage} />
        </div>
      </div>

      {/* 2. PRESS STRIP */}
      <div className="pressStrip" style={styles.pressStrip}>
        <span style={{fontSize: '12px', color: '#888', fontWeight: 'bold'}}>FEATURED IN</span>
        <span style={styles.pressLogo}>HYPEBEAST</span>
        <span style={styles.pressLogo}>Highsnobiety</span>
        <span style={styles.pressLogo}>GQ</span>
        <span style={styles.pressLogo}>ELLE</span>
      </div>

      {/* 3. FRESH PICKS (PRODUCTS GRID) */}
      {/* Notice the id="shop" here - this is what the buttons scroll to! */}
      <div className="container" id="shop" style={styles.productsSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.kicker}>NEW ARRIVALS</p>
            <h2 style={styles.sectionTitle}>FRESH PICKS.<br/>LATEST VIBES.</h2>
          </div>
          <button onClick={scrollToShop} style={styles.viewAll}>VIEW ALL</button>
        </div>

        <div style={styles.grid}>
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* 4. PROMO BANNERS */}
      <div className="container promo-layout" style={styles.promoSection}>
        {/* Left Promo */}
        <div style={{...styles.promoBox, backgroundColor: 'var(--nexa-white)'}}>
          <div style={{padding: '40px', flex: 1}}>
            <p style={styles.kicker}>COLLECTION</p>
            <h2 style={{fontSize: '32px', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px'}}>KEEP IT<br/>SIMPLE.<br/>KEEP IT YOU.</h2>
            <p style={{fontSize: '14px', color: 'var(--nexa-gray)', marginBottom: '30px'}}>Pieces that fit your life<br/>and your mindset.</p>
            
            {/* FIXED BUTTON */}
            <button className="nexa-btn" onClick={scrollToShop}>Explore Collection</button>
          </div>
          <div style={{flex: 1, backgroundImage: 'url(https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600)', backgroundSize: 'cover', backgroundPosition: 'center'}} />
        </div>

        {/* Right Promo */}
        <div style={{...styles.promoBox, backgroundColor: 'var(--nexa-olive)', color: 'white'}}>
           <div style={{padding: '40px', zIndex: 2}}>
              <h2 style={{fontSize: '32px', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px'}}>BUILT DIFFERENT.<br/>MADE BETTER.</h2>
              <p style={{fontSize: '14px', opacity: 0.8, marginBottom: '30px'}}>Sustainable materials.<br/>Timeless style.</p>
              
              {/* FIXED BUTTON */}
              <button className="nexa-btn" style={{backgroundColor: 'white', color: 'var(--nexa-black)'}} onClick={scrollToShop}>
                Learn More
              </button>
           </div>
           <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600" alt="Sneaker" style={{position: 'absolute', right: '-50px', bottom: '-50px', height: '120%', opacity: 0.9, mixBlendMode: 'luminosity'}} />
        </div>
      </div>

      {/* 5. FOOTER FEATURES */}
      <div style={styles.featuresStrip}>
        <div className="container features-layout" style={styles.featuresContainer}>
          <div style={styles.featureItem}>
            <span style={{fontSize: '24px'}}>🚚</span>
            <div>
              <p style={{fontWeight: 'bold', fontSize: '13px'}}>FREE SHIPPING</p>
              <p style={{fontSize: '12px', opacity: 0.7}}>On orders over $50</p>
            </div>
          </div>
          <div style={styles.featureItem}>
            <span style={{fontSize: '24px'}}>⏱️</span>
            <div>
              <p style={{fontWeight: 'bold', fontSize: '13px'}}>EASY RETURNS</p>
              <p style={{fontSize: '12px', opacity: 0.7}}>30-day return policy</p>
            </div>
          </div>
          <div style={styles.featureItem}>
            <span style={{fontSize: '24px'}}>🔒</span>
            <div>
              <p style={{fontWeight: 'bold', fontSize: '13px'}}>SECURE PAYMENT</p>
              <p style={{fontSize: '12px', opacity: 0.7}}>100% protected checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { width: '100%', overflowX: 'hidden' },
  heroSection: { display: 'flex', alignItems: 'center', paddingTop: '80px', paddingBottom: '60px', minHeight: '70vh' },
  heroLeft: { flex: 1, paddingRight: '40px' },
  heroTitle: { fontSize: 'clamp(50px, 6vw, 80px)', fontWeight: '800', lineHeight: '0.95', letterSpacing: '-0.03em', marginBottom: '24px' },
  heroSubtitle: { fontSize: '16px', color: 'var(--nexa-gray)', marginBottom: '40px', lineHeight: '1.6' },
  heroRight: { flex: 1.2, height: '500px', backgroundColor: '#e2e5df', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  heroImage: { width: '80%', objectFit: 'contain', mixBlendMode: 'multiply', transform: 'rotate(-10deg)' },
  pressStrip: { borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '30px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', backgroundColor: 'var(--nexa-white)' },
  pressLogo: { fontSize: '18px', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px' },
  productsSection: { paddingTop: '100px', paddingBottom: '80px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
  kicker: { fontSize: '10px', fontWeight: '700', color: 'var(--nexa-gray)', letterSpacing: '1px', marginBottom: '8px' },
  sectionTitle: { fontSize: '32px', fontWeight: '800', lineHeight: 1.1, letterSpacing: '-0.02em' },
  viewAll: { fontSize: '12px', fontWeight: '700', textDecoration: 'none', color: 'var(--nexa-black)', borderBottom: '1px solid var(--nexa-black)', paddingBottom: '2px', background: 'none', border: 'none', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px' },
  promoSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', paddingBottom: '100px' },
  promoBox: { display: 'flex', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '350px', position: 'relative' },
  featuresStrip: { backgroundColor: '#8a9485', color: 'white', padding: '40px 0' },
  featuresContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '15px' }
};

export default HomeScreen;