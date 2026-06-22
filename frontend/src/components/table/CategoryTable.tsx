import { useDeleteCategory } from "../../hooks/category/useDeleteCategory"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import type { CategoryFormType, CategoryFormTypeProps } from "../../types/category"

export const CategoryTable = ({ setForm, setEditingId }: CategoryFormTypeProps) => {
    const { deleteCategory } = useDeleteCategory()
    const categories = useAppSelector((state) => state.category.categories)

    const handleEdit = (id: string, form: CategoryFormType) => {
        setEditingId(id)
        setForm({ name: form.name, description: form.description })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this category? This action cannot be undone.")) {
            await deleteCategory(id)
        }
    }

    if (categories.length === 0) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                <i className="bi bi-tags mb-2" style={{ fontSize: "2rem", color: "#b6cfb6" }} />
                <p className="mb-0" style={{ color: "#8a9e8a", fontSize: "0.875rem" }}>
                    No categories yet. Create one to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="table-responsive">
            <table className="table mb-0" style={{ fontSize: "0.875rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f4f7f4", borderBottom: "1px solid #dde8dd" }}>
                        <th
                            style={{
                                width: 40,
                                color: "#5a7a5a",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "10px 12px",
                                border: "none",
                            }}
                        >
                            #
                        </th>
                        <th
                            style={{
                                color: "#5a7a5a",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "10px 12px",
                                border: "none",
                            }}
                        >
                            Name
                        </th>
                        <th
                            style={{
                                color: "#5a7a5a",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "10px 12px",
                                border: "none",
                            }}
                        >
                            Description
                        </th>
                        <th
                            style={{
                                color: "#5a7a5a",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "10px 12px",
                                border: "none",
                                textAlign: "right",
                            }}
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr
                            key={category._id}
                            style={{ borderBottom: "1px solid #f0f4f0", transition: "background 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafcfa")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                        >
                            <td style={{ padding: "12px 12px", color: "#8a9e8a", fontWeight: 500, border: "none" }}>
                                {index + 1}
                            </td>
                            <td style={{ padding: "12px 12px", fontWeight: 500, color: "#1a2e1a", border: "none" }}>
                                {category.name}
                            </td>
                            <td
                                style={{
                                    padding: "12px 12px",
                                    color: "#6b826b",
                                    border: "none",
                                    maxWidth: 280,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {category.description || (
                                    <span style={{ color: "#c0cfc0" }}>—</span>
                                )}
                            </td>
                            <td style={{ padding: "12px 12px", border: "none", textAlign: "right", whiteSpace: "nowrap" }}>
                                <button
                                    className="btn btn-sm me-2"
                                    onClick={() => handleEdit(category._id, category)}
                                    title="Edit category"
                                    style={{
                                        color: "#1a7a4a",
                                        background: "none",
                                        border: "none",
                                        padding: "2px 6px",
                                        fontWeight: 500,
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    <i className="bi bi-pencil-fill me-1" />
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => handleDelete(category._id)}
                                    title="Delete category"
                                    style={{
                                        color: "#c0392b",
                                        background: "none",
                                        border: "none",
                                        padding: "2px 6px",
                                        fontWeight: 500,
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    <i className="bi bi-trash3-fill me-1" />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}