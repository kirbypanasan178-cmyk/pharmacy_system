import React, { useState } from "react";
import { signupFormInitialState, type SignupFormType } from "../../types/user";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ErrorLabel } from "../ui/errorLabel";
import { useSignupUser } from "../../hooks/useSignupUser";
import "../../css/SignupForm.css";
import { signupValidation, type ValidationErrorsSignup } from "../../validators/signup";
import { useAppSelector } from "../../hooks/redux/reduxHooks";

const PharmacyIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z" />
    <rect x="11" y="12" width="2" height="8" />
    <rect x="8" y="15" width="8" height="2" />
  </svg>
);

export const SignupForm: React.FC = () => {
  const [form, setForm] = useState<SignupFormType>(signupFormInitialState);

  const [errors, setErrors] = useState<ValidationErrorsSignup>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signupUser } = useSignupUser();
  const { error, loading } = useAppSelector((state) => state.auth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors = signupValidation(form);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const success = await signupUser(form);
      if (!success) {
        console.log("Signup failed")
        return
      }
      setErrors({});
      setForm(signupFormInitialState)
      console.log("SIGNUP SUCCESS", form);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const addressFields = ["street", "barangay", "city", "province", "zipcode"];

    if (addressFields.includes(id)) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [id]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [id]: id === "age" ? Number(value) || 0 : value,
      }));
    }

    if (submitted) {
      const updatedForm = addressFields.includes(id)
        ? { ...form, address: { ...form.address, [id]: value } }
        : { ...form, [id]: id === "age" ? Number(value) || 0 : value };
      setErrors(signupValidation(updatedForm));
    }
  };

  // Helper: add input-error class when field has an error after submit
  const inputClass = (field: keyof ValidationErrorsSignup) =>
    `signup-input${submitted && errors?.[field] ? " input-error" : ""}`;

  const selectClass = (field: keyof ValidationErrorsSignup) =>
    `signup-select${submitted && errors?.[field] ? " input-error" : ""}`;

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* Brand */}
        <div className="signup-brand">
          <div className="signup-brand-icon">
            <PharmacyIcon />
          </div>
          <div>
            <div className="signup-brand-name">PharmaCare</div>
            <div className="signup-brand-tagline">Create your account</div>
          </div>
        </div>

        <hr className="signup-divider" />

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Personal Information ── */}
          <div className="signup-section">
            <h4 className="signup-section-title">Personal information</h4>

            <div className="signup-grid-2">
              <div>
                <Label htmlFor="fullname" className="signup-label">
                  Fullname <span className="req">*</span>
                </Label>
                <Input
                  id="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="John H. Batumbakal"
                  className={inputClass("fullname")}
                />
                {submitted && errors?.fullname && (
                  <ErrorLabel message={errors.fullname} className="signup-error" />
                )}
              </div>

              <div>
                <Label htmlFor="birthplace" className="signup-label">
                  Birthplace <span className="req">*</span>
                </Label>
                <Input
                  id="birthplace"
                  value={form.birthplace}
                  onChange={handleChange}
                  placeholder="Davao City"
                  className={inputClass("birthplace")}
                />
                {submitted && errors?.birthplace && (
                  <ErrorLabel message={errors.birthplace} className="signup-error" />
                )}
              </div>
            </div>

            <div className="signup-grid-3">
              <div>
                <Label htmlFor="age" className="signup-label">
                  Age <span className="req">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={handleChange}
                  className={inputClass("age")}
                />
                {submitted && errors?.age && (
                  <ErrorLabel message={errors.age} className="signup-error" />
                )}
              </div>

              <div>
                <Label htmlFor="gender" className="signup-label">
                  Gender <span className="req">*</span>
                </Label>
                <Select
                  id="gender"
                  selectSize="md"
                  value={form.gender}
                  onChange={handleChange}
                  className={selectClass("gender")}
                  options={[
                    { label: "Male",   value: "male"   },
                    { label: "Female", value: "female" },
                    { label: "Other",  value: "other"  },
                  ]}
                />
                {submitted && errors?.gender && (
                  <ErrorLabel message={errors.gender} className="signup-error" />
                )}
              </div>

              <div>
                <Label htmlFor="birthdate" className="signup-label">
                  Birthdate <span className="req">*</span>
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                  className={inputClass("birthdate")}
                />
                {submitted && errors?.birthdate && (
                  <ErrorLabel message={errors.birthdate} className="signup-error" />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="signup-label">
                Phone <span className="req">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="09XXXXXXXX"
                className={inputClass("phone")}
              />
              {submitted && errors?.phone && (
                <ErrorLabel message={errors.phone} className="signup-error" />
              )}
            </div>
          </div>

          {/* ── Address ── */}
          <div className="signup-section">
            <h4 className="signup-section-title">Address</h4>

            <div>
              <Label htmlFor="street" className="signup-label">
                Street <span className="req">*</span>
              </Label>
              <Input
                id="street"
                value={form.address.street}
                onChange={handleChange}
                placeholder="Jacinto Street"
                className={inputClass("street")}
              />
              {submitted && errors?.street && (
                <ErrorLabel message={errors.street} className="signup-error" />
              )}
            </div>

            <div className="signup-grid-2">
              <div>
                <Label htmlFor="barangay" className="signup-label">
                  Barangay <span className="req">*</span>
                </Label>
                <Input
                  id="barangay"
                  value={form.address.barangay}
                  onChange={handleChange}
                  placeholder="Brgy. New Clarin"
                  className={inputClass("barangay")}
                />
                {submitted && errors?.barangay && (
                  <ErrorLabel message={errors.barangay} className="signup-error" />
                )}
              </div>

              <div>
                <Label htmlFor="city" className="signup-label">
                  City <span className="req">*</span>
                </Label>
                <Input
                  id="city"
                  value={form.address.city}
                  onChange={handleChange}
                  placeholder="Davao City"
                  className={inputClass("city")}
                />
                {submitted && errors?.city && (
                  <ErrorLabel message={errors.city} className="signup-error" />
                )}
              </div>
            </div>

            <div className="signup-grid-21">
              <div>
                <Label htmlFor="province" className="signup-label">
                  Province <span className="req">*</span>
                </Label>
                <Input
                  id="province"
                  value={form.address.province}
                  onChange={handleChange}
                  placeholder="Davao del Sur"
                  className={inputClass("province")}
                />
                {submitted && errors?.province && (
                  <ErrorLabel message={errors.province} className="signup-error" />
                )}
              </div>

              <div>
                <Label htmlFor="zipcode" className="signup-label">
                  ZIP code <span className="req">*</span>
                </Label>
                <Input
                  id="zipcode"
                  value={form.address.zipcode}
                  onChange={handleChange}
                  placeholder="8000"
                  className={inputClass("zipcode")}
                />
                {submitted && errors?.zipcode && (
                  <ErrorLabel message={errors.zipcode} className="signup-error" />
                )}
              </div>
            </div>
          </div>

          {/* ── Account Information ── */}
          <div className="signup-section">
            <h4 className="signup-section-title">Account information</h4>

            <div>
              <Label htmlFor="email" className="signup-label">
                Email <span className="req">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="johntest@gmail.com"
                className={inputClass("email")}
              />
              {submitted && errors?.email && (
                <ErrorLabel message={errors.email} className="signup-error" />
              )}
            </div>

            <div className="signup-grid-2">
              <div>
                <Label htmlFor="password" className="signup-label">
                  Password <span className="req">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass("password")}
                />
                {submitted && errors?.password && (
                  <ErrorLabel message={errors.password ?? error ?? undefined} className="signup-error" />
                )}
                {submitted && error && (
                  <ErrorLabel message={error} className="signup-error"/>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="signup-label">
                  Confirm password <span className="req">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputClass("confirmPassword")}
                />
                {submitted && errors?.confirmPassword && (
                  <ErrorLabel message={errors.confirmPassword }  className="signup-error" />
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={isLoading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>

      </div>
    </div>
  );
};