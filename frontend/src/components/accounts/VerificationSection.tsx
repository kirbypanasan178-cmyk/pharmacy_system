import { VerificationForm } from "../forms/VerificationForm";

export const VerificationSection = () => {
  return (
    <div style={{ width: "80vw", maxWidth: "100%" }}>
      <div className="overflow-hidden">
        <VerificationForm />
      </div>
    </div>
  );
};