import { useState, useRef, useEffect } from "react"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Select } from "../ui/Select"
import { productValidation } from "../../validators/product"
import { type ValidationErrors } from "../../types/validation"
import { useCreateProduct } from "../../hooks/useCreateProduct"
import { ErrorLabel } from "../ui/errorLabel"
import { useUpdateProduct } from "../../hooks/useUpdateProduct"
import { productInitialForm, type ProductFormTypeProps } from "../../types/product"

export const ProductForm = ({ editingId, form, setForm, setEditingId }: ProductFormTypeProps) => {
  const { createProduct } = useCreateProduct()
  const { updateProduct } = useUpdateProduct()
  const [error, setError] = useState<ValidationErrors>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = productValidation(form)
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors)
      return
    }
    if (editingId) {
      await updateProduct(editingId, form)
    } else {
      await createProduct(form)
    }
    setForm(productInitialForm)
    setEditingId(null)
    setError({})
    setImagePreview(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setForm((prev) => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value,
    }))
  }

  const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0]
  if (!file) return

  // store actual file
  setForm((prev) => ({
    ...prev,
    image: file,
  }))

  // preview only
  const reader = new FileReader()

  reader.onloadend = () => {
    setImagePreview(reader.result as string)
  }

  reader.readAsDataURL(file)
}

  const handleRemoveImage = () => {
    setImagePreview(null)
    setForm((prev) => ({ ...prev, image: null }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleReset = () => {
    setForm(productInitialForm)
    setError({})
    setEditingId(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  useEffect(() => {
  if (typeof form.image === "string" && form.image !== "") {
    setImagePreview(form.image)  // existing cloudinary URL
  } else if (!form.image) {
    setImagePreview(null)        // reset when form is cleared
  }
}, [form.image])

  return (
    <div className="product-card">
      {/* Card header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #0D6EFD, #17C3A2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          📦
        </div>
        <div>
          <p className="product-section-title mb-0">
            {editingId ? "Edit Product" : "New Product"}
          </p>
          <p className="product-section-subtitle mb-0">
            {editingId
              ? "Update the fields below and save"
              : "Fill in the details to add a product"}
          </p>
        </div>
      </div>

      {/* Editing banner */}
      {editingId && (
        <div className="editing-banner mb-3">
          ✏️ Editing product ID:{" "}
          <strong style={{ fontFamily: "monospace" }}>{editingId}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form" noValidate>

        {/* ── Image Upload ── */}
        <div className="mb-3">
          <Label>Product Image</Label>

          {/* Drop zone / preview */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--c-border)",
              borderRadius: 12,
              background: imagePreview ? "#000" : "#FAFCFF",
              cursor: "pointer",
              overflow: "hidden",
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--c-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--c-border)")
            }
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
                {/* Overlay on hover */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    color: "#fff",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    gap: 6,
                  }}
                  className="img-overlay"
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.opacity = "0")
                  }
                >
                  🔄 Click to change
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--c-muted)",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 6 }}>🖼️</div>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>
                  Click to upload image
                </p>
                <p style={{ fontSize: "0.72rem", margin: "2px 0 0" }}>
                  PNG, JPG, WEBP — max 5MB
                </p>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {/* Remove button */}
          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="btn btn-sm mt-2"
              style={{
                fontSize: "0.75rem",
                color: "var(--c-danger)",
                border: "1px solid rgba(229,83,75,0.25)",
                borderRadius: 8,
                padding: "3px 10px",
                background: "rgba(229,83,75,0.06)",
              }}
            >
              🗑 Remove image
            </button>
          )}
        </div>

        {/* Name */}
        <div className="mb-3">
          <Label>Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Paracetamol 500mg"
          />
          <ErrorLabel message={error.name} className="field-error" />
        </div>

        {/* Description */}
        <div className="mb-3">
          <Label>Description</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Short product description…"
            rows={3}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <Label>Category</Label>
          <Select
            id="category"
            value={form.category}
            onChange={handleChange}
            selectSize="md"
            options={[
              { label: "Select a category", value: "" },
              { label: "Fever",             value: "fever" },
              { label: "Cough",             value: "cough" },
              { label: "Other",             value: "other" },
            ]}
          />
          <ErrorLabel message={error.category} className="field-error" />
        </div>

        {/* Price & Stock */}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <Label>Price (₱)</Label>
            <Input
              id="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
            />
            <ErrorLabel message={error.price} className="field-error" />
          </div>
          <div className="col-6">
            <Label>Stock</Label>
            <Input
              id="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              placeholder="0"
            />
            <ErrorLabel message={error.stock} className="field-error" />
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 pt-1">
          <button type="submit" className="btn btn-primary flex-fill">
            {editingId ? "💾 Save Changes" : "＋ Create Product"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline-secondary"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}