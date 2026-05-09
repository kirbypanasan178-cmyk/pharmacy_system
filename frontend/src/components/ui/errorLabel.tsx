const IconError = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type Variant = "error" | "success";

interface ErrorLabelProps {
  message?: string;
  variant?: Variant;
  className?: string;
}

export const ErrorLabel: React.FC<ErrorLabelProps> = ({
  message,
  variant = "error",
  className = "",
}) => {
  if (!message) return null;

  const isError = variant === "error";

  return (
    <div
      className={`d-flex align-items-center gap-1 ${
        isError ? "text-danger" : "text-success"
      } ${className}`}
      style={{ fontSize: "0.8rem" }}
    >
      {isError ? <IconError /> : <IconCheck />}
      <span>{message}</span>
    </div>
  );
};