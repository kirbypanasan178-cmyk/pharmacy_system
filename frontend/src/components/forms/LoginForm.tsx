import { useState } from "react";
import { Input } from "../ui/Input";
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

export const LoginForm = () => {
  const [form, setForm] = useState<LoginFormType>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate()

  const { loginUser } = useLoginUser();
  const [formErrors, setFormErrors] = useState<ValidationErrorsLogin>({});
  const { loading } = useAppSelector((state) => state.auth)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error on change
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
          navigate("/admin")
        } else {
           navigate("/home")
        }
       
    } catch (error) {
        console.error("Login failed:", error);
    }
};

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <PharmacyIcon />
          </div>
          <div>
            <div className="login-brand-name">PharmaCare</div>
            <div className="login-brand-tagline">Sign in to your account</div>
          </div>
        </div>

        <hr className="login-divider" />

        <form onSubmit={handleSubmit} noValidate>

          {/* EMAIL */}
          <div className="login-field">
            <Label htmlFor="email" className="login-label">
              Email <span className="req">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className={`login-input${formErrors.email ? " input-error" : ""}`}
            />
            <ErrorLabel message={formErrors.email} className="login-error" />
          </div>

          {/* PASSWORD */}
          <div className="login-field">
            <Label htmlFor="password" className="login-label">
              Password <span className="req">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`login-input${formErrors.password ? " input-error" : ""}`}
            />
            <ErrorLabel message={formErrors.password} className="login-error" />
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
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <a href="/signup">Create one</a>
        </p>

      </div>
    </div>
  );
};