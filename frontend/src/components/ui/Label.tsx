import React from "react";

type LabelVariant = "default" | "required" | "optional" | "info";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  variant?: LabelVariant;
  hint?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  variant = "default",
  hint,
  className = "",
  ...props
}) => {
  const isRequired = variant === "required";

  return (
    <label
      className={`form-label fw-medium ${className}`}
      {...props}
    >
      <span>
        {children}
        {isRequired && <span className="text-danger ms-1">*</span>}
      </span>

      {hint && (
        <span className="text-muted small ms-2">
          {hint}
        </span>
      )}
    </label>
  );
};