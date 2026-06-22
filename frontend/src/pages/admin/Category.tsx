import { useEffect, useState } from "react"
import { CategoryForm } from "../../components/forms/CategoryForm"
import { CategoryTable } from "../../components/table/CategoryTable"
import { categoryInitialFrom, type CategoryFormType } from "../../types/category"
import "../../css/Category.css"
import { useGetAllCategory } from "../../hooks/category/useGetAllCategory"

export const Category = () => {
    const [form, setForm] = useState<CategoryFormType>(categoryInitialFrom)
    const [editingId, setEditingId] = useState<string | null>(null)

    const { getAllCategory } = useGetAllCategory()

    useEffect(() => {
        getAllCategory()
    }, [])

    const handleCancelEdit = () => {
        setEditingId(null)
        setForm(categoryInitialFrom)
    }

    return (
        <div className="cp-page">

            {/* Page Header */}
            <div className="cp-header">
                <div className="cp-header-inner">
                    <div className="cp-header-icon">
                        <i className="bi bi-tags-fill" />
                    </div>
                    <div>
                        <h2 className="cp-title">Category Management</h2>
                        <p className="cp-subtitle">Manage and organize your product categories</p>
                    </div>
                </div>
                <div className="cp-header-badge">
                    <i className="bi bi-grid-3x3-gap-fill" />
                    Catalog
                </div>
            </div>

            <div className="cp-divider" />

            {/* Content */}
            <div className="cp-content-row">

                {/* Form Card */}
                <div className="cp-col-form">
                    <div className="cp-card">
                        <div className="cp-card-header">
                            <p className="cp-card-title">
                                <i className={`bi ${editingId ? "bi-pencil-square" : "bi-plus-circle-fill"}`} />
                                {editingId ? "Edit Category" : "New Category"}
                            </p>
                            {editingId && (
                                <span className="cp-header-badge" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>
                                    <i className="bi bi-pencil" />
                                    Editing
                                </span>
                            )}
                        </div>
                        <div className="cp-card-body">
                            <CategoryForm
                                form={form}
                                setForm={setForm}
                                editingId={editingId}
                                setEditingId={setEditingId}
                            />
                            {editingId && (
                                <button
                                    className="cp-btn-secondary"
                                    style={{ marginTop: "0.6rem" }}
                                    onClick={handleCancelEdit}
                                >
                                    <i className="bi bi-x-circle" />
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="cp-col-table">
                    <div className="cp-card cp-card-table">
                        <div className="cp-card-header">
                            <p className="cp-card-title">
                                <i className="bi bi-table" />
                                All Categories
                            </p>
                        </div>
                        <CategoryTable
                            form={form}
                            setForm={setForm}
                            editingId={editingId}
                            setEditingId={setEditingId}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}