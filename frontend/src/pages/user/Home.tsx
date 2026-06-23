import { useEffect, useState } from "react";
import { ProductCard } from "../../components/cards/ProductCard";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/Home.css";
import { useNavigate } from "react-router-dom";
import { useCreateCart } from "../../hooks/cart/useCreateCart";
import type { Product } from "../../features/productSlice";
import { useGetAllCategory } from "../../hooks/category/useGetAllCategory";
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";
import { useGetAllCart } from "../../hooks/cart/useGetAllCart";

const getStockStatus = (stock: number): "in-stock" | "low-stock" | "out" => {
  if (stock <= 0)  return "out";
  if (stock <= 10) return "low-stock";
  return "in-stock";
};

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const ProductCardWrapper = ({ product }: { product: Product }) => {
  const { createCart, throttled } = useCreateCart()

  const handleAddToCart = async (product: Product) => {
    await createCart({
      items: [{ product: product._id, quantity: 1, price: product.price }],
    });
  };

  return (
    <ProductCard 
      name={product.name}
      category={product.category?.name ?? ""}
      price={product.price}
      originalPrice={product.price}
      image={product.image}
      stock={product.stock}
      stockStatus={getStockStatus(product.stock)}
      onAdd={() => handleAddToCart(product)}
      throttled={throttled}
    />
  )
}

export const Home = () => {
  const { products, error, loading } = useAppSelector((state) => state.product);
  const { getAllCategory } = useGetAllCategory();
  const { getAllProduct } = useGetAllProduct();
  const { getAllCart } = useGetAllCart();

  const categories = useAppSelector((state) => state.category.categories);
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const cart = useAppSelector((state) => state.cart.cart);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const user = parsedUser?.user;
    const fetch = async () => {
      getAllCategory();
      getAllProduct();
      if (!user || !user._id) return;
      await getAllCart();
    };
    fetch();
  }, []);

  const items = cart?.items ?? [];
  const cartCount = items.length ?? 0;

  

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCart = () => navigate("/cart");
  const handleAccount = () => navigate("/account");

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav className="pc-navbar">
        <div className="pc-navbar-inner">
          {/* Brand */}
          <div className="pc-navbar-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="pc-navbar-logo">Pharmacare</span>
          </div>

          {/* Search */}
          <div className="pc-navbar-search">
            <div className="search-wrapper" style={{ width: "100%" }}>
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg"
                width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1
                  1 0 0 0 1.415-1.414l-3.868-3.834zm-5.242 1.1a5.5 5.5 0
                  1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
              <input
                className="search-input"
                placeholder="Search medicines, vitamins…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pc-navbar-actions">
            <button onClick={handleCart} className="pc-nav-btn" title="Cart">
              <span className="pc-nav-btn-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                  fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89
                    3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13
                    12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61
                    2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102z"/>
                  <path d="M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0
                    4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1
                    0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                {cartCount > 0 && (
                  <span className="pc-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                )}
              </span>
              {!isMobile && <span className="pc-nav-label">Cart</span>}
            </button>

            <button onClick={handleAccount} className="pc-nav-btn" title="Profile">
              <span className="pc-nav-btn-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                  fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1
                    1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4
                    6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516
                    10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168
                    1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
              </span>
              {!isMobile && <span className="pc-nav-label">Profile</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="pc-page-content">

        {/* ── Hero Banner ── */}
        <div className="hero-banner mb-4">
          <span className="hero-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="6" cy="6" r="6" opacity=".4"/>
              <circle cx="6" cy="6" r="3.5"/>
            </svg>
            Trusted Pharmacy
          </span>
          <h1 className="hero-title">
            Welcome to <em>Pharmacare</em>
          </h1>
          <p className="hero-subtitle">
            Your health, our priority — quality medicines delivered fast.
          </p>
        </div>

        {/* ── Category Filter ── */}
        <div className="category-filter mb-3">
          <p className="section-label">Shop by Category</p>
          <div className="section-divider" />
          <div className="category-scroll">
            <button
              className={`category-chip ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7
                  2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1
                  5.5v-3zM9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15
                  2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9
                  5.5v-3zm-8 7A1.5 1.5 0 0 1 2.5 8h3A1.5 1.5 0 0 1 7
                  9.5v3A1.5 1.5 0 0 1 5.5 14h-3A1.5 1.5 0 0 1 1
                  12.5v-3zm8 0A1.5 1.5 0 0 1 10.5 8h3a1.5 1.5 0 0 1 1.5
                  1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9
                  12.5v-3z"/>
              </svg>
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                className={`category-chip ${selectedCategory === category.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="products-header mb-3">
          <p className="section-label">Products</p>
          {!loading && (
            <span className="results-meta">
              Showing <strong>{filteredProducts.length}</strong> of{" "}
              <strong>{products.length}</strong> items
            </span>
          )}
        </div>
        <div className="section-divider" />

        {/* Loading skeletons */}
        {loading && (
          <div className="product-grid mb-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pc-card">
                <div className="skeleton" style={{ height: 180 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14 }}>
                  <div className="skeleton" style={{ height: 18, width: "70%" }} />
                  <div className="skeleton" style={{ height: 14, width: "40%" }} />
                  <div className="skeleton" style={{ height: 36, borderRadius: 50, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="pc-alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8
                0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1
                4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1
                0L7.1 4.995z"/>
            </svg>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h5>No products found</h5>
            <p>Try a different keyword or browse all categories.</p>
            <button
              className="category-chip active"
              onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="product-grid mb-5 p-2">
            {filteredProducts.map((product) => (

              <ProductCardWrapper
                key={product._id}
                product={product}
              />

            ))}
          </div>
        )}
      </div>
    </>
  );
};