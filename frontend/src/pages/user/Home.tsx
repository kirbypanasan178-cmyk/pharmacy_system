import { useState } from "react";
import { ProductCard } from "../../components/cards/ProductCard";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/Home.css";

export const Home = () => {
  const { products, error, loading } = useAppSelector((state) => state.product);
  const categories = useAppSelector((state) => state.category.categories);

  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleAddToCart = () => {};

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
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

      {/* ── Search + Stats Row ────────────────── */}
      <div className="row align-items-center g-3 mb-4">
        {/* Search */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="search-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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

        {/* Stats */}
        <div className="col-12 col-md-6 col-lg-7">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
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
        <div className="product-grid mb-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pc-card">
              <div className="skeleton" style={{ height: 160 }} />
              <div className="pc-body gap-2">
                <div className="skeleton" style={{ height: 18, width: "70%" }} />
                <div className="skeleton" style={{ height: 14, width: "40%" }} />
                <div className="skeleton mt-2" style={{ height: 36, borderRadius: 50 }} />
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
        <div className="product-grid mb-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category?.name || "Unknown Category"}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};