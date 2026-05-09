import "./App.css";
import { AdminNavBar } from "./components/layout/AdminNavbar";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from "./pages/user/Dashboard";
import { Product } from "./pages/admin/Product";
import { Order } from "./pages/admin/Order";
import { User } from "./pages/admin/User";
import { Settings } from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex min-vh-100">

        {/* Sidebar / Navbar */}
        <AdminNavBar />

        {/* Main Content */}
        <div className="flex-grow-1 overflow-auto p-3">

          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/user" element={<User />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;