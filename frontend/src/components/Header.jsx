// frontend/src/components/Header.jsx

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [keyword, setKeyword] = useState('');
  
  // State to control the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartBadgeCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false); // Close menu on logout
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?search=${keyword}`);
    else navigate('/');
    setIsMenuOpen(false); // Close menu on search
  };

  return (
    <header className="glass-header" style={styles.header}>
      <div className="container header-nav" style={styles.nav}>
        
        {/* Left: Brand */}
        <div className="logo-box" style={styles.logoContainer}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}>
            <h1 style={styles.logo}>NEXA</h1>
          </Link>
        </div>

        {/* The Hamburger Button (Hidden on Desktop) */}
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* The Animated Dropdown Container */}
        <div className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
          
          {/* Center: Links */}
          <div className="centerLinks" style={styles.centerLinks}>
            <Link to="/" style={styles.link} onClick={() => setIsMenuOpen(false)}>Shop</Link>
            
            {/* WHATSAPP SUPPORT LINK */}
            <a 
              href="https://wa.me/917838663862?text=Hi%20NEXA%20Support!%20I%20need%20help%20with..." 
              target="_blank" 
              rel="noreferrer" 
              style={{...styles.link, color: '#059669', fontWeight: 'bold'}}
              onClick={() => setIsMenuOpen(false)}
            >
              Support (Chat)
            </a>
          </div>

          {/* Right: Icons & User */}
          <div className="right-icons" style={styles.rightIcons}>
             <form onSubmit={submitHandler} style={styles.searchForm}>
               <input 
                 type="text" 
                 placeholder="Search..." 
                 value={keyword}
                 onChange={(e) => setKeyword(e.target.value)}
                 style={styles.searchInput}
               />
               <button type="submit" style={styles.searchBtn}>🔍</button>
             </form>
             
             {userInfo ? (
               <div style={styles.userMenu}>
                 {userInfo.isAdmin && (
                   <div style={{display: 'flex', gap: '10px', marginRight: '15px'}}>
                     <Link to="/admin/products" style={styles.adminBtn} onClick={() => setIsMenuOpen(false)}>Products</Link>
                     <Link to="/admin/orders" style={{...styles.adminBtn, borderColor: '#2563eb', color: '#2563eb'}} onClick={() => setIsMenuOpen(false)}>Orders</Link>
                     {/* FIXED: Added the Users admin link! */}
                     <Link to="/admin/userlist" style={{...styles.adminBtn, borderColor: '#d97706', color: '#d97706'}} onClick={() => setIsMenuOpen(false)}>Users</Link>
                   </div>
                 )}
                 <Link to="/profile" style={{textDecoration: 'none', color: 'inherit'}} onClick={() => setIsMenuOpen(false)}>
                   <span style={styles.userName}>{userInfo.name.split(' ')[0]}</span>
                 </Link>
                 <span style={styles.logoutBtn} onClick={logoutHandler}>(Logout)</span>
               </div>
             ) : (
               <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}><span style={styles.icon}>👤</span></Link>
             )}

             <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }} onClick={() => setIsMenuOpen(false)}>
               <span style={styles.icon}>🛍️</span>
               {cartBadgeCount > 0 && <span style={styles.cartBadge}>{cartBadgeCount}</span>}
             </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

const styles = {
  header: { padding: '20px 0', position: 'sticky', top: 0, zIndex: 100 }, 
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, 
  logoContainer: { flex: 1 }, 
  logo: { fontSize: '24px', letterSpacing: '2px', margin: 0, fontWeight: '800' }, 
  centerLinks: { flex: 2, display: 'flex', justifyContent: 'center', gap: '40px' }, 
  link: { fontSize: '13px', textDecoration: 'none', color: 'var(--nexa-black)', fontWeight: '500' }, 
  rightIcons: { flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '20px', alignItems: 'center' }, 
  icon: { fontSize: '18px', cursor: 'pointer' }, 
  cartBadge: { position: 'absolute', top: '-6px', right: '-10px', backgroundColor: 'var(--nexa-black)', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px', fontWeight: 'bold' }, 
  userMenu: { display: 'flex', gap: '8px', alignItems: 'center' }, 
  userName: { fontSize: '13px', fontWeight: '600' },
  logoutBtn: { fontSize: '12px', color: 'var(--nexa-gray)', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' },
  searchForm: { display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--nexa-black)' },
  searchInput: { border: 'none', background: 'transparent', width: '100px', fontSize: '13px', padding: '5px', outline: 'none', color: 'var(--nexa-black)' },
  searchBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  adminBtn: { textDecoration: 'none', color: '#059669', fontWeight: 'bold', fontSize: '12px', border: '1px solid #059669', padding: '4px 8px', borderRadius: '4px' }
};

export default Header;