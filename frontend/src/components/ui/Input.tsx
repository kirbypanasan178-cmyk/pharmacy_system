import React from "react";

type InputVariant = "default" | "error" | "success";
type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  inputSize?: InputSize; // ✅ renamed (IMPORTANT)
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  variant = "default",
  inputSize = "md",
  className = "",
  ...props
}) => {
  const variantClass =
    variant === "error"
      ? "is-invalid"
      : variant === "success"
      ? "is-valid"
      : "";

  const sizeClass =
    inputSize === "sm"
      ? "form-control-sm"
      : inputSize === "lg"
      ? "form-control-lg"
      : "";

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}

      <input
        className={`form-control bg-secondary-subtle ${sizeClass} ${variantClass} ${className}`}
        {...props}
      />

      {hint && !error && (
        <div className="form-text text-muted">{hint}</div>
      )}

      {error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
};