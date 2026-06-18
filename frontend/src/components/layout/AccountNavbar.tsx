import { useNavigate, useLocation } from "react-router-dom";
import "../../css/AccountNavbar.css";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Profile",         path: "/account/profile",  icon: "ti ti-user"         },
  { label: "Change Password", path: "/account/password", icon: "ti ti-lock"         },
  { label: "Privacy",         path: "/account/privacy",  icon: "ti ti-shield"       },
  { label: "My Orders",       path: "/account/orders",   icon: "ti ti-shopping-bag" },
];

interface AccountNavbarProps {
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  user?: { name: string; email: string; initials: string };
}

export const AccountNavbar = ({
  onNavigate,
  onLogout,
}: AccountNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname;

  const handleClick = (path: string) => {
    navigate(path);
    onNavigate?.(path);
  };

  return (
    <nav aria-label="Account navigation" className="account-nav">
  

      {/* Section label */}
      <p className="account-nav-section-label">My Account</p>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.path;
        return (
          <button
            key={item.path}
            onClick={() => handleClick(item.path)}
            aria-current={isActive ? "page" : undefined}
            className={`account-nav-btn${isActive ? " active" : ""}`}
          >
            {isActive && <span className="account-nav-active-bar" />}
            <i className={`${item.icon} account-nav-icon`} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Logout */}
      <div className="account-nav-logout-wrap">
        <button className="account-nav-btn account-nav-logout" onClick={onLogout}>
          <i className="ti ti-logout account-nav-icon" aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
};