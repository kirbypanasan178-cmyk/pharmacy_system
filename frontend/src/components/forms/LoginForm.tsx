import { useState } from "react";
import { Label } from "../ui/Label";
import { type LoginFormType } from "../../types/user";
import { ErrorLabel } from "../ui/errorLabel";
import { useLoginUser } from "../../hooks/useLoginUser";
import "../../css/LoginForm.css";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import { loginValidation, type ValidationErrorsLogin } from "../../validators/login";
import { useNavigate } from "react-router-dom";

const PharmacyIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z" />
    <rect x="11" y="12" width="2" height="8" />
    <rect x="8" y="15" width="8" height="2" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5.5 3.8 9 8 11 4.2-2 8-5.5 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 16V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10" />
    <path d="M14 10h4l3 3v3h-7" />
    <path d="M5 18H3v-2M16 18H9" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
  </svg>
);

const features = [
  { icon: <ShieldCheckIcon />, text: "Verified medicines from licensed suppliers" },
  { icon: <TruckIcon />, text: "Same-day delivery across Davao City" },
  { icon: <HeadsetIcon />, text: "Licensed pharmacists on call, 24/7" },
];

export const LoginForm = () => {
  const [form, setForm] = useState<LoginFormType>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const { loginUser } = useLoginUser();
  const [formErrors, setFormErrors] = useState<ValidationErrorsLogin>({});
  const { loading, error } = useAppSelector((state) => state.auth);

  const safeError = error ?? undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name as keyof ValidationErrorsLogin]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = loginValidation(form);
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const user = await loginUser(form);
      if (!user) return;

      if (user.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-shell d-flex min-vh-100">
      {/* Brand panel — desktop only */}
      <div className="login-visual d-none d-lg-flex col-lg-6 flex-column justify-content-between p-5">
        <svg className="login-visual-pattern" aria-hidden="true">
          <defs>
            <pattern id="capsules" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <rect x="8" y="27" width="48" height="18" rx="9" fill="none" stroke="white" strokeWidth="1.5" />
              <line x1="32" y1="27" x2="32" y2="45" stroke="white" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#capsules)" />
        </svg>

        <div className="login-visual-content">
          <div className="d-flex align-items-center gap-2 mb-5">
            <div className="login-brand-icon login-brand-icon--on-dark">
              <PharmacyIcon />
            </div>
            <span className="login-brand-name text-white">PharmaCare</span>
          </div>

          <h1 className="login-visual-headline">Medicine, delivered with care.</h1>
          <p className="login-visual-sub">
            Order prescriptions, track deliveries, and reach a licensed pharmacist — all from one account.
          </p>
        </div>

        <ul className="login-feature-list list-unstyled mb-0">
          {features.map((f) => (
            <li key={f.text} className="d-flex align-items-center gap-3">
              <span className="login-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="login-panel col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
        <div className="login-card-inner w-100">
          {/* Brand — mobile only */}
          <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
            <div className="login-brand-icon">
              <PharmacyIcon />
            </div>
            <span className="login-brand-name">PharmaCare</span>
          </div>

          <h2 className="login-heading">Welcome back</h2>
          <p className="login-subheading">Sign in to manage your orders and prescriptions</p>

          <form onSubmit={handleSubmit} noValidate className="mt-4">
            {/* EMAIL */}
            <div className="login-field">
              <Label htmlFor="email" className="login-label">
                Email <span className="req">*</span>
              </Label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`login-input${formErrors.email ? " input-error" : ""}`}
                />
              </div>
              <ErrorLabel message={formErrors.email || safeError} className="login-error" />
            </div>

            {/* PASSWORD */}
            <div className="login-field">
              <Label htmlFor="password" className="login-label">
                Password <span className="req">*</span>
              </Label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`login-input${formErrors.password ? " input-error" : ""}`}
                />
              </div>
              <ErrorLabel message={formErrors.password || safeError} className="login-error" />
            </div>

            {/* REMEMBER ME + FORGOT */}
            <div className="login-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="login-forgot">
                Forgot password?
              </a>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="btn login-btn w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
};