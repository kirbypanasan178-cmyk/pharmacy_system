import { useState } from "react";
import { ProductCard } from "../../components/cards/ProductCard";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/Home.css";
import { useNavigate } from "react-router-dom";
import { useCreateCart } from "../../hooks/cart/useCreateCart";
import type { Product } from "../../features/productSlice";

export const Home = () => {
  const { products, error, loading } = useAppSelector((state) => state.product);
  const { createCart } = useCreateCart()
  const categories = useAppSelector((state) => state.category.categories);


  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const cart = useAppSelector((state) => state.cart.cart)
  const items = cart?.items ?? []

  const cartCount = items.length ?? 0;

  const handleAddToCart = async (product: Product) => {
     await createCart({
      items: [
        {
          product: product._id,
          quantity: 1,
          price: product.price
        }
      ]
     })
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <>
      {/* ── Top Navbar (Shopee-style) ─────────── */}
      <nav className="pc-navbar">
        <div className="pc-navbar-inner">
          {/* Brand */}
          <div className="pc-navbar-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round">
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

          {/* Right actions */}
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
              <span className="pc-nav-label">Cart</span>
            </button>

            <button className="pc-nav-btn" title="Profile">
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
              <span className="pc-nav-label">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page content ──────────────────────── */}
      <div className="container py-4" style={{ maxWidth: 1280 }}>

        {/* ── Hero Banner ───────────────────────── */}
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

        {/* ── Stats Row ────────────────────────── */}
        <div className="row align-items-center g-3 mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2 justify-content-start">
              <div className="stat-pill">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0
                      0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2
                      2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="stat-value">{products.length}</div>
                  <div className="stat-label">Products</div>
                </div>
              </div>
              <div className="stat-pill">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674
                      8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15
                      5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11z"/>
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1
                      6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0
                      1.5-1.5V6.954z"/>
                  </svg>
                </div>
                <div>
                  <div className="stat-value">{categories.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
              <div className="stat-pill">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1
                      4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703
                      0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381
                      2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="stat-value">{filteredProducts.length}</div>
                  <div className="stat-label">Results</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Filter ───────────────────── */}
        <div className="mb-4">
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
                className={`category-chip ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Grid ──────────────────────── */}
        <div className="d-flex align-items-center justify-content-between mb-3">
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
          <div className="row g-3 mb-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="col-12 col-md-4 col-lg-3">
                <div className="pc-card h-100">
                  <div className="skeleton" style={{ height: 220 }} />
                  <div className="pc-body gap-2">
                    <div className="skeleton" style={{ height: 18, width: "70%" }} />
                    <div className="skeleton" style={{ height: 14, width: "40%" }} />
                    <div className="skeleton mt-2" style={{ height: 36, borderRadius: 50 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="alert d-flex align-items-center gap-2"
            style={{ background: "#fff3f3", border: "1.5px solid #f9c6c6",
              borderRadius: 12, color: "#b91c1c" }}>
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
            <h5 style={{ fontFamily: "'DM Serif Display', serif" }}>
              No products found
            </h5>
            <p className="mb-3" style={{ fontSize: ".9rem" }}>
              Try a different keyword or browse all categories.
            </p>
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
          <div className="row g-3 mb-5">
            {filteredProducts.map((product) => (
              <div key={product._id} className="col-12 col-md-4 col-lg-3">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category?.name || "Unknown Category"}
                  onAdd={() => handleAddToCart(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};