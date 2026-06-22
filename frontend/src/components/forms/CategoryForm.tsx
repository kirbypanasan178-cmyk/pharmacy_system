import { useState } from "react";
import { categoryInitialFrom, type CategoryFormTypeProps } from "../../types/category";
import { useCreateCategory } from "../../hooks/category/useCreateCategory";
import { useUpdateCategory } from "../../hooks/category/useUpdateCategory";
import { categoryValidation, type ValidationErrorsCategory } from "../../validators/category";
import { useAppSelector } from "../../hooks/redux/reduxHooks";

export const CategoryForm = ({
    form,
    setForm,
    editingId,
    setEditingId,
}: CategoryFormTypeProps) => {
    const { createCategory } = useCreateCategory();
    const { updateCategory } = useUpdateCategory();
    const { loading } = useAppSelector((state) => state.category);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ name: "", description: "" });
        setErrors({});
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "#4a6a4a",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 6,
    };

    const hintStyle: React.CSSProperties = {
        fontSize: "0.72rem",
        color: "#8a9e8a",
    };

    return (
        <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="mb-3">
                <label htmlFor="cf-name" style={labelStyle}>
                    <i className="bi bi-fonts me-1" />
                    Name
                </label>
                <input
                    id="cf-name"
                    name="name"
                    type="text"
                    className={`form-control${errors.name ? " is-invalid" : ""}`}
                    placeholder="e.g. Vitamins"
                    value={form.name}
                    maxLength={60}
                    autoFocus
                    onChange={handleChange}
                    style={{ fontSize: "0.875rem", borderColor: errors.name ? undefined : "#dde8dd" }}
                />
                <div className="d-flex justify-content-between align-items-center mt-1">
                    {errors.name
                        ? <div className="invalid-feedback d-block" style={{ fontSize: "0.78rem" }}>{errors.name}</div>
                        : <span />
                    }
                    <span style={hintStyle}>{form.name.length} / 60</span>
                </div>
            </div>

            {/* Description */}
            <div className="mb-4">
                <label htmlFor="cf-desc" style={labelStyle}>
                    <i className="bi bi-text-left me-1" />
                    Description
                    <span style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.72rem", color: "#8a9e8a", fontWeight: 400, marginLeft: 4 }}>
                        (optional)
                    </span>
                </label>
                <textarea
                    id="cf-desc"
                    name="description"
                    className="form-control"
                    placeholder="Briefly describe this category…"
                    value={form.description}
                    maxLength={300}
                    rows={3}
                    onChange={handleChange}
                    style={{ fontSize: "0.875rem", resize: "none", borderColor: "#dde8dd" }}
                />
                <div className="d-flex justify-content-end mt-1">
                    <span style={hintStyle}>{form.description?.length || 0} / 300</span>
                </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2">
                {editingId && (
                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={handleCancel}
                        style={{
                            border: "1px solid #dde8dd",
                            color: "#4a6a4a",
                            backgroundColor: "#fff",
                            fontSize: "0.825rem",
                            padding: "7px 14px",
                        }}
                    >
                        <i className="bi bi-x-lg me-1" />
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-sm flex-grow-1"
                    disabled={!form.name.trim() || loading}
                    style={{
                        backgroundColor: "#1a7a4a",
                        color: "#fff",
                        border: "none",
                        fontSize: "0.825rem",
                        fontWeight: 600,
                        padding: "7px 14px",
                    }}
                >
                    <i className={`bi ${editingId ? "bi-check-lg" : "bi-plus-lg"} me-1`} />
                    {loading ? "Loading..." : editingId ? "Save Changes" : "Create Category"}
                </button>
            </div>

        </form>
    );
};