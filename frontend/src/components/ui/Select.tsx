import React from "react";

type SelectVariant = "default" | "error" | "success";
type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: SelectVariant;
  selectSize?: SelectSize;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  variant = "default",
  selectSize = "md",
  options,
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
    selectSize === "sm"
      ? "form-select-sm"
      : selectSize === "lg"
      ? "form-select-lg"
      : "";

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium">{label}</label>}

      <select
        className={`form-select ${sizeClass} ${variantClass} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>

        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {hint && !error && (
        <div className="form-text text-muted">{hint}</div>
      )}

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};