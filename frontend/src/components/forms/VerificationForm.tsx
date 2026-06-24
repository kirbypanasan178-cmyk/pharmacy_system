import { useState, type ChangeEvent } from "react";
import { getToken } from "../../utils/getToken";

export const VerificationForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const token = getToken();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected?.type.startsWith("/image")) {
      setPreview(URL.createObjectURL(selected)); // creates a temporary URL pointing to the uploaded file
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setStatus("loading");

    const formData = new FormData(); // built in browser object use to send data
    formData.append("file", file); // field name: "file", value: file

    try {
      const res = await fetch("http://localhost:2000/api/email/send-file", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("File sent successfully");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };
  
  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setStatus("idle")
    setMessage("")
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm p-4" style={{ borderRadius: 16 }}>
        <h2 className="h5 fw-semibold mb-4">Send a file</h2>
        <div className="mb-3">
          <label className="form-label text-muted" style={{ fontSize: 14 }}>
            Select image or PDF
          </label>
          <input
            type="file"
            accept="image/*, application/pdf"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="Preview"
              className="img-fluid rounded"
              style={{ maxHeight: 200, objectFit: "cover" }}
            />
          </div>
        )}

        {file && !preview && (
          <div className="mb-3 p-3 bg-light rounded d-flex align-items-center gap-2">
            <span style={{ fontSize: 24 }}>📄</span>
            <span style={{ fontSize: 14 }}>{file.name}</span>
          </div>
        )}

        {status === "success" && (
          <div className="alert alert-success py-2" style={{ fontSize: 14 }}>
            ✅{message}
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-danger py-2" style={{ fontSize: 14 }}>
            ❌{message}
          </div>
        )}

        <div className="d-flex gap-3">
          <button
            className="btn btn-secondary w-100"
            onClick={handleReset}
            disabled={!file || status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span className="spinner-border spinner-border-sm me-2">
                  Sending...
                </span>
              </>
            ) : (
              "Reset"
            )}
          </button>

          <button
            className="btn btn-success w-100"
            onClick={handleSubmit}
            disabled={!file || status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span className="spinner-border spinner-border-sm me-2">
                  Sending...
                </span>
              </>
            ) : (
              "Send File"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
