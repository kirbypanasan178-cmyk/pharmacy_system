import "../../css/UserNavbar.css";

export const UserNavbar = () => {
  return (
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
              type="text"
            />
          </div>
        </div>

        <button className="btn btn-primary">Search</button>

        {/* Actions */}
        <div className="pc-navbar-actions">

          {/* Cart */}
          <button className="pc-nav-btn" title="Cart">
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
              <span className="pc-badge">0</span>
            </span>
            <span className="pc-nav-label">Cart</span>
          </button>

          {/* Profile */}
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
  );
};