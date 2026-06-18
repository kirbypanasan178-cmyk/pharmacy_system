import { useLocation, useNavigate } from "react-router-dom";
import "../../css/AdminNavbar.css";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import { useGetUser } from "../../hooks/users/useGetUser";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import { getInitials } from "../../utils/getInitials";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",  path: "/admin",          icon: "bi bi-grid-1x2-fill" },
  { label: "Products",   path: "/admin/product",  icon: "bi bi-box-seam-fill", badge: 3 },
  { label: "Orders",     path: "/admin/order",    icon: "bi bi-receipt",       badge: 12 },
  { label: "Users",      path: "/admin/user",     icon: "bi bi-people-fill" },
  { label: "Categories", path: "/admin/category", icon: "bi bi-tags-fill" },
  { label: "Map",        path: "/admin/map",      icon: "bi bi-map-fill" },
  { label: "Settings",   path: "/admin/settings", icon: "bi bi-gear-fill" },
];

export const AdminNavBar: React.FC = () => {
  const user = useAppSelector((state) => state.user.user)
  const navigate = useNavigate();
  const location = useLocation();

  const { getUser } = useGetUser()

  const parsedUser = useUser()

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isActive = (path: string): boolean => location.pathname === path;

  useEffect(() => {
    getUser(parsedUser.user._id)
  }, [])

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-content">

        {/* Brand */}
        <div className="sidebar-brand">
          <button className="brand-button" onClick={() => navigate("/admin")}>
            <div className="brand-logo">
              <i className="bi bi-lightning-charge-fill" />
            </div>
            <div>
              <div className="brand-text">AdminPanel</div>
              <div className="brand-tagline">Control Center</div>
            </div>
            <div className="status-dot" title="System Online" />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "8px 10px", flex: 1 }}>
          <div className="nav-section-label">Navigation</div>

          {NAV_ITEMS.map(({ label, path, icon, badge }) => {
            const active = isActive(path);
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`nav-pill-item ${active ? "active" : ""}`}
              >
                <div className="nav-icon-wrap">
                  <i className={icon} />
                </div>
                <span className="nav-label">{label}</span>
                {badge !== undefined && (
                  <span className={`nav-badge ${active ? "green" : "muted"}`}>
                    {badge}
                  </span>
                )}
                {active && <i className="bi bi-chevron-right nav-chevron" />}
              </button>
            );
          })}

          <div className="sidebar-divider" />
          <div className="nav-section-label">Support</div>

          <button className="nav-pill-item" onClick={() => navigate("/admin/help")}>
            <div className="nav-icon-wrap"><i className="bi bi-question-circle" /></div>
            <span className="nav-label">Help & Docs</span>
          </button>

          <button className="nav-pill-item" onClick={() => navigate("/admin/feedback")}>
            <div className="nav-icon-wrap"><i className="bi bi-chat-dots" /></div>
            <span className="nav-label">Feedback</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{getInitials(user?.fullname)}</div>
            <div className="user-info">
              <div className="user-name">{user?.fullname}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <i className="bi bi-three-dots-vertical user-options" />
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />
            <span>Sign out</span>
          </button>
        </div>

      </div>
    </aside>
  );
};