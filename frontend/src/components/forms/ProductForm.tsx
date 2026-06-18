import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import { productValidation, type ValidationErrorsProduct } from "../../validators/product";
import { useCreateProduct } from "../../hooks/product/useCreateProduct";
import { ErrorLabel } from "../ui/errorLabel";
import { useUpdateProduct } from "../../hooks/product/useUpdateProduct";
import {
  productInitialForm,
  type ProductFormTypeProps,
} from "../../types/product";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/ProductForm.css"

export const ProductForm = ({
  editingId,
  form,
  setForm,
  setEditingId,
}: ProductFormTypeProps) => {
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const categories = useAppSelector((state) => state.category.categories);

  const [error, setError] = useState<ValidationErrorsProduct>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = productValidation(form);
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    if (editingId) {
      await updateProduct(editingId, form);
    } else {
      await createProduct(form);
    }
    handleReset();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    setForm(productInitialForm);
    setError({});
    setEditingId(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (typeof form.image === "string" && form.image !== "") {
      setImagePreview(form.image);
    } else if (!form.image) {
      setImagePreview(null);
    }
  }, [form.image]);

  return (
    <div className="product-card">

      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <div className="product-form-icon">
          <span>📦</span>
        </div>
        <div>
          <p className="product-section-title mb-0">
            {editingId ? "Edit Product" : "New Product"}
          </p>
          <p className="product-section-subtitle mb-0">
            {editingId ? "Update the fields below and save" : "Fill in the details to add a product"}
          </p>
        </div>
      </div>

      {editingId && (
        <div className="editing-banner mb-2">
          ✏️ Editing ID: <strong style={{ fontFamily: "monospace" }}>{editingId}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form" noValidate>

        {/* Image */}
        <div className="product-form-section-label">Product Image</div>
        <div className="mb-2">
          <div
            className={`product-upload-zone ${imagePreview ? "has-preview" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="product-upload-preview-img" />
                <div className="product-upload-overlay">🔄 Click to change</div>
              </>
            ) : (
              <div className="product-upload-placeholder">
                <div className="product-upload-icon">🖼️</div>
                <p className="product-upload-hint">Click to upload image</p>
                <p className="product-upload-hint-sub">PNG, JPG, WEBP — max 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {imagePreview && (
            <button type="button" onClick={handleRemoveImage} className="product-remove-btn">
              🗑 Remove image
            </button>
          )}
        </div>

        <div className="product-form-divider" />

        {/* Basic Info */}
        <div className="product-form-section-label">Basic Info</div>

        <div className="mb-2">
          <Label>Name</Label>
          <Input id="name" value={form.name} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" />
          <ErrorLabel message={error.name} className="field-error" />
        </div>

        <div className="mb-2">
          <Label>Description</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Short product description…"
            rows={2}
          />
        </div>

        <div className="mb-0">
          <Label>Category</Label>
          <Select
            id="category"
            value={form.category}
            onChange={handleChange}
            selectSize="md"
            options={categories.map((category) => ({
              label: category.name,
              value: category._id,
            }))}
          />
          <ErrorLabel message={error.category} className="field-error" />
        </div>

        <div className="product-form-divider" />

        {/* Pricing & Stock */}
        <div className="product-form-section-label">Pricing & Stock</div>

        <div className="row g-2 mb-0">
          <div className="col-6">
            <Label>Price (₱)</Label>
            <div className="product-input-prefix-wrap">
              <span className="product-input-prefix"></span>
              <Input
                id="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                placeholder="0.00"
                className="product-input-prefixed"
              />
            </div>
            <ErrorLabel message={error.price} className="field-error" />
          </div>
          <div className="col-6">
            <Label>Stock</Label>
            <Input id="stock" value={form.stock} onChange={handleChange} type="number" placeholder="0" />
            <ErrorLabel message={error.stock} className="field-error" />
          </div>
        </div>

        <div className="product-form-divider" />

        {/* Actions */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-fill">
            {editingId ? "💾 Save Changes" : "＋ Create Product"}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
            Reset
          </button>
        </div>

      </form>
    </div>
  );
};