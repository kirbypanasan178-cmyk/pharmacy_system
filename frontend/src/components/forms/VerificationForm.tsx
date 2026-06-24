import { useState, type ChangeEvent } from "react";
import { getToken } from "../../utils/getToken";

export const VerificationForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  const token = getToken();

  const processFile = (selected: File | null) => {
    setFile(selected);
    setStatus("idle");
    setMessage("");
    setPreview(selected?.type.startsWith("image/") ? URL.createObjectURL(selected) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => processFile(e.target.files?.[0] ?? null);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setStatus("loading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:2000/api/email/send-file", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Your business permit has been submitted to the admin.");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setMessage("");
  };

  const isPdf = file && !preview;

  return (
    <div className="d-flex justify-content-center px-3 py-4" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="w-100" style={{ maxWidth: 500 }}>
        <div className="rounded-4 overflow-hidden border-0 shadow-sm" >

          {/* Header */}
          <div className="d-flex align-items-center gap-3 px-4 py-3" style={{ background: "#15803d" }}>
            <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-2" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <h2 className="mb-0 fw-bold text-white" style={{ fontSize: 15, fontFamily: "'Fraunces', Georgia, serif" }}>Business Permit Submission</h2>
              <p className="mb-0" style={{ fontSize: 12, color: "#86efac" }}>Upload your permit to complete pharmacy verification</p>
            </div>
          </div>

          {/* Notice */}
          <div className="d-flex align-items-center gap-2 px-4 py-2" style={{ background: "#f0fdf4", borderBottom: "1px solid #dcfce7", fontSize: 12, color: "#16a34a" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Accepted formats: PNG, JPG, PDF — max 10 MB</span>
          </div>

          <div className="p-4">

            {/* Drop zone */}
            {status !== "success" && (
              <label
                className="d-block w-100 text-center mb-3 rounded-3"
                style={{
                  border: `2px dashed ${dragging || file ? "#16a34a" : "#86efac"}`,
                  minHeight: 170,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept="image/*, application/pdf" className="d-none" onChange={handleFileChange} />

                {!file && (
                  <div className="d-flex flex-column align-items-center gap-2 py-4">
                    <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 52, height: 52, background: "#dcfce7", color: "#16a34a" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                      </svg>
                    </div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: 13, color: "#14532d" }}>Drag & drop your file here</p>
                    <p className="mb-0" style={{ fontSize: 12, color: "#6b7280" }}>or <span style={{ color: "#16a34a", textDecoration: "underline" }}>browse to upload</span></p>
                  </div>
                )}

                {preview && (
                  <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
                )}

                {isPdf && (
                  <div className="d-flex flex-column align-items-center gap-1 py-4">
                    <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 48, height: 48, background: "#dcfce7", color: "#16a34a" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: 13, color: "#14532d", wordBreak: "break-all", padding: "0 12px", textAlign: "center" }}>{file.name}</p>
                    <p className="mb-0" style={{ fontSize: 11, color: "#9ca3af" }}>{(file.size / 1024).toFixed(1)} KB — click to change</p>
                  </div>
                )}
              </label>
            )}

            {/* Success */}
            {status === "success" && (
              <div className="d-flex gap-3 p-3 mb-3 rounded-3" style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="mb-1 fw-bold" style={{ fontSize: 13, color: "#14532d" }}>Permit submitted!</p>
                  <p className="mb-0" style={{ fontSize: 12, color: "#6b7280" }}>{message}</p>
                </div>
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="d-flex gap-3 p-3 mb-3 rounded-3" style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p className="mb-1 fw-bold" style={{ fontSize: 13, color: "#b91c1c" }}>Submission failed</p>
                  <p className="mb-0" style={{ fontSize: 12, color: "#6b7280" }}>{message}</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="d-flex gap-3">
              <button
                className="btn w-100"
                style={{ border: "1px solid #d1d5db", fontSize: 13, borderRadius: 8, color: "#374151" }}
                onClick={handleReset}
                disabled={!file && status === "idle"}
              >
                Clear
              </button>
              <button
                className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ background: "#16a34a", color: "#fff", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "none" }}
                onClick={status === "success" ? handleReset : handleSubmit}
                disabled={!file || status === "loading"}
              >
                {status === "loading" ? (
                  <><span className="spinner-border spinner-border-sm" /> Submitting…</>
                ) : status === "success" ? "Submit Another" : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Submit Permit
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};