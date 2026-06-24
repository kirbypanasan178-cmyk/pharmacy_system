import "./App.css";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "./pages/user/Home";
import { Product } from "./pages/admin/Product";
import { Order } from "./pages/admin/Order";
import { User } from "./pages/admin/User";
import { Settings } from "./pages/admin/Settings";
import { Category } from "./pages/admin/Category";
import { Dashboard } from "./pages/admin/Dashboard";
import { Cart } from "./pages/user/Cart";
import { ProfileSection } from "./components/accounts/ProfileSection";
import { PasswordSection } from "./components/accounts/PasswordSection";
import { PrivacySection } from "./components/accounts/PrivacySection";
import { OrderSection } from "./components/accounts/OrderSection";
import { PayPalSuccess } from "./pages/user/PayPalSuccess";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Map } from "./pages/admin/Map";
import { Account } from "./pages/user/Account";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import PaymentFailed from "./pages/user/PaymentFailed";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { VerificationSection } from "./components/accounts/VerificationSection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public only */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paypal-success"
          element={
            <ProtectedRoute>
              <PayPalSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/failed"
          element={
            <ProtectedRoute>
              <PaymentFailed />
            </ProtectedRoute>
          }
        />

        {/* Account routes - cleaner pattern */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="verification" element={<VerificationSection />} />
          <Route path="password" element={<PasswordSection />} />
          <Route path="privacy" element={<PrivacySection />} />
          <Route path="orders" element={<OrderSection />} />
        </Route>

        {/* Admin routes */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="category" element={<Category />} />
          <Route path="order" element={<Order />} />
          <Route path="user" element={<User />} />
          <Route path="map" element={<Map />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
