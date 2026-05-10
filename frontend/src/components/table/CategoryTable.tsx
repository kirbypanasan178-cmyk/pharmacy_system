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
        <div className="ct-wrapper">
            <div className="ct-card">

                {/* Header */}
                <div className="ct-header">
                    <div className="ct-header-left">
                        <div className="ct-header-icon">
                            <i className="bi bi-table" />
                        </div>
                        <div>
                            <h5 className="ct-title">Categories</h5>
                            <p className="ct-subtitle">{categories.length} total</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {categories.length === 0 ? (
                    <div className="ct-empty">
                        <i className="bi bi-inbox ct-empty-icon" />
                        <p className="ct-empty-text">No categories yet.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table ct-table mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id} className="ct-row">
                                        <td className="ct-index">{index + 1}</td>
                                        <td className="ct-name">{category.name}</td>
                                        <td className="ct-desc">
                                            {category.description
                                                ? category.description
                                                : <span className="ct-no-desc">—</span>}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-secondary me-2"
                                                onClick={() => handleEdit(category._id, category)}
                                            >
                                                <i className="bi bi-pencil-fill me-1" />
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(category._id)}
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
                )}

            </div>
        </div>
    )
}