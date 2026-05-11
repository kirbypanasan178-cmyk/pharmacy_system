import "./App.css";
import { AdminNavBar } from "./components/layout/AdminNavbar";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/user/Home";
import { Product } from "./pages/admin/Product";
import { Order } from "./pages/admin/Order";
import { User } from "./pages/admin/User";
import { Settings } from "./pages/admin/Settings";
import { Category } from "./pages/admin/Category";
import { useEffect } from "react";
import { useGetAllCategory } from "./hooks/category/useGetAllCategory";
import { Dashboard } from "./pages/admin/Dashboard";
import { useGetAllProduct } from "./hooks/product/useGetAllProduct";

function App() {
  const { getAllCategory } = useGetAllCategory()
  const { getAllProduct } = useGetAllProduct()

  useEffect(() => {
    getAllCategory()
    getAllProduct();
  }, [])

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

  
      <Route 
      path="/admin/*"
      element={
        <div className="d-flex min-vh-100">

        {/* Sidebar / Navbar */}
        <AdminNavBar />

        {/* Main Content */}
        <div className="flex-grow-1 overflow-auto p-3">

          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product" element={<Product />} />
            <Route path="category" element={<Category />} />
            <Route path="order" element={<Order />} />
            <Route path="user" element={<User />} />
            <Route path="settings" element={<Settings />} />
          </Routes>

        </div>
      

      </div>
      }
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;