import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AccountNavbar } from "./AccountNavbar";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/AccountLayout.css";

export const AccountLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = localStorage.getItem("user")
  const parsedUser = storedUser ? JSON.parse(storedUser) : null

  const cart = useAppSelector((state) => state.cart.cart);
  const user = useAppSelector((state) => state.auth.user)
  const items = cart?.items ?? [];
  const cartCount = items.length ?? 0;

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("cartId")
    navigate("/login");
  };

  const handleHome = () => navigate("/home");
  const handleCart = () => navigate("/cart");


  return (
    <div className="account-page">
      {/* ── Top Navbar ── */}
      <nav className="pc-navbar">
        <div className="pc-navbar-inner">
          {/* Brand */}
          <div className="pc-navbar-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="pc-navbar-logo">Pharmacare</span>
          </div>

          <span className="pc-navbar-sep">/</span>
          <span className="pc-navbar-crumb">{parsedUser?.email}</span>

          {/* Actions */}
          <div className="pc-navbar-actions">
            {user?.isActive && (
              <>
                <button onClick={handleHome} className="pc-nav-btn" title="Home">
              <span className="pc-nav-btn-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                  fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5
                    7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0
                    0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13
                    5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354
                    1.146z" />
                </svg>
              </span>
              <span className="pc-nav-label">Home</span>
            </button>

            <button onClick={handleCart} className="pc-nav-btn" title="Cart">
              <span className="pc-nav-btn-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                  fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89
                    3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13
                    12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61
                    2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102z" />
                  <path d="M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0
                    4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1
                    0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="pc-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                )}
              </span>
              <span className="pc-nav-label">Cart</span>
            </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="account-content">
        <div className="account-shell">
          {/* Mobile topbar */}
          <div className="account-mobile-topbar">
            <span className="account-mobile-title">My Account</span>
            <button
              type="button"
              className="account-hamburger"
              aria-label="Toggle account menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <i className={`ti ${sidebarOpen ? "ti-x" : "ti-menu-2"}`} aria-hidden="true" />
            </button>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="account-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`account-sidebar${sidebarOpen ? " open" : ""}`}>
            <AccountNavbar
              handleLogout={handleLogout}
              onNavigate={() => setSidebarOpen(false)}
            />
          </aside>

          {/* Main content */}
          <main className="account-main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};