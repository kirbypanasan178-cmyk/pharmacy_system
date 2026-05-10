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

      // Reset form after success
      setForm(categoryInitialFrom);

      // Clear editing state
      setEditingId(null);

      // Clear validation errors
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return (
    <div className="cf-wrapper">
      <div className="cf-card">

        {/* Header */}
        <div className="cf-header">
          <div className="cf-header-icon">
            <i className="bi bi-tags-fill" />
          </div>

          <div>
            <h4 className="cf-title">
              {editingId ? "Edit Category" : "New Category"}
            </h4>

            <p className="cf-subtitle">
              {editingId
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Body */}
          <div className="cf-body">

            {/* Name */}
            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-name">
                <i className="bi bi-fonts me-1" /> Name
              </label>

              <input
                id="cf-name"
                name="name"
                type="text"
                className="form-control cf-input"
                placeholder="e.g. Electronics"
                value={form.name}
                maxLength={60}
                autoFocus
                onChange={handleChange}
              />

              <span className="cf-hint">
                {form.name.length} / 60
              </span>

              {errors.name && (
                <div className="text-danger mt-1">
                  {errors.name}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-desc">
                <i className="bi bi-text-left me-1" /> Description
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

              <span className="cf-hint">
                {form.description?.length || 0} / 300
              </span>
            </div>

          </div>

          {/* Footer */}
          <div className="cf-footer">

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => {
                  setEditingId(null);

                  setForm({
                    name: "",
                    description: "",
                  });

                  setErrors({});
                }}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="btn cf-btn-submit"
              disabled={!form.name.trim()}
            >
              <i
                className={`bi ${
                  editingId ? "bi-pencil-fill" : "bi-plus-lg"
                } me-1`}
              />

              {editingId
                ? "Save Changes"
                : "Create Category"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};