import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Library from "./pages/Library";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Subscription from "./pages/Subscription";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderConfirmation from "./pages/order-confirmation";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { CartProvider } from "./context/CartContext";
import { CommentsProvider } from "./context/CommentsContext";

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <CartProvider>
          <CommentsProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/book/:id" element={<Book />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
            </Routes>
            <Footer />
          </CommentsProvider>
        </CartProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
