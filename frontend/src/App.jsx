// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentScreen from './screens/PaymentScreen';       // 1. Import Payment
import PlaceOrderScreen from './screens/PlaceOrderScreen';  // 2. Import Place Order
import OrderScreen from './screens/OrderScreen';
import LoginScreen from './screens/LoginScreen';    // 3. Import Login 
import RegisterScreen from './screens/RegisterScreen';
import AdminProductList from './screens/AdminProductList';
import AdminProductEdit from './screens/AdminProductEdit';
import AdminOrderList from './screens/AdminOrderList';
import AdminUserList from './screens/AdminUserList';
import ProfileScreen from './screens/ProfileScreen';
 
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// This "Interceptor" is the most powerful way to fix "No Token" errors
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/product/:id/edit" element={<AdminProductEdit />} />
          <Route path="/admin/orders" element={<AdminOrderList />} />
          <Route path="/admin/userlist" element={<AdminUserList />} />
          <Route path="/profile" element={<ProfileScreen />} />
          
          {/* 3. Add the final two routes */}
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          
          <Route path="/shop" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Shop All Screen Coming Soon</h2></div>} />
          <Route path="/furniture" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Furniture Category Coming Soon</h2></div>} />
          <Route path="/about" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>About NEXA Coming Soon</h2></div>} />
          <Route path="*" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>404 - Page Not Found</h2></div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;