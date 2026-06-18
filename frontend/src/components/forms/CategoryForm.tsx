import { useState } from "react";
import "../../css/CategoryForm.css";

import { categoryInitialFrom, type CategoryFormTypeProps } from "../../types/category";

import { useCreateCategory } from "../../hooks/category/useCreateCategory";
import { useUpdateCategory } from "../../hooks/category/useUpdateCategory";

import {
  categoryValidation,
  type ValidationErrorsCategory,
} from "../../validators/category";

export const CategoryForm = ({
  form,
  setForm,
  editingId,
  setEditingId,
}: CategoryFormTypeProps) => {
  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();

  const [errors, setErrors] = useState<ValidationErrorsCategory>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = categoryValidation(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }

      setForm(categoryInitialFrom);
      setEditingId(null);
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Body */}
      <div className="cf-body">

        {/* Name */}
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-name">
            <i className="bi bi-fonts me-1" />
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            className={`form-control cf-input${errors.name ? " is-invalid" : ""}`}
            placeholder="e.g. Vitamins"
            value={form.name}
            maxLength={60}
            autoFocus
            onChange={handleChange}
          />
          <div className="d-flex justify-content-between align-items-center">
            {errors.name
              ? <div className="text-danger">{errors.name}</div>
              : <span />
            }
            <span className="cf-hint">{form.name.length} / 60</span>
          </div>
        </div>

        {/* Description */}
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-desc">
            <i className="bi bi-text-left me-1" />
            Description
            <span className="ms-1 fw-normal" style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.72rem", color: "var(--cf-hint)" }}>
              (optional)
            </span>
          </label>
          <textarea
            id="cf-desc"
            name="description"
            className="form-control cf-textarea"
            placeholder="Briefly describe this category…"
            value={form.description}
            maxLength={300}
            rows={4}
            onChange={handleChange}
          />
          <span className="cf-hint">{form.description?.length || 0} / 300</span>
        </div>

      </div>

      {/* Footer */}
      <div className="cf-footer">
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            <i className="bi bi-x-lg me-1" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn cf-btn-submit"
          disabled={!form.name.trim()}
        >
          <i className={`bi ${editingId ? "bi-check-lg" : "bi-plus-lg"} me-1`} />
          {editingId ? "Save Changes" : "Create Category"}
        </button>
      </div>

    </form>
  );
};