import { useDeleteCategory } from "../../hooks/category/useDeleteCategory"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import type { CategoryFormType, CategoryFormTypeProps } from "../../types/category"
import "../../css/CategoryTable.css"

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

    return (
        <>
            {categories.length === 0 ? (
                <div className="ct-empty">
                    <i className="bi bi-tags ct-empty-icon" />
                    <p className="ct-empty-text">No categories yet. Create one to get started.</p>
                </div>
            ) : (
                <div className="ct-table-wrap">
                    <table className="ct-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category._id} className="ct-row">
                                    <td>
                                        <span className="ct-index">{index + 1}</span>
                                    </td>
                                    <td className="ct-name">{category.name}</td>
                                    <td className="ct-desc">
                                        {category.description
                                            ? category.description
                                            : <span className="ct-no-desc">—</span>
                                        }
                                    </td>
                                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                        <button
                                            className="ct-action-edit me-2"
                                            title="Edit category"
                                            onClick={() => handleEdit(category._id, category)}
                                        >
                                            <i className="bi bi-pencil-fill" />
                                            Edit
                                        </button>
                                        <button
                                            className="ct-action-delete"
                                            title="Delete category"
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            <i className="bi bi-trash3-fill" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}