import { useState } from "react"
import { CategoryForm } from "../../components/forms/CategoryForm"
import { CategoryTable } from "../../components/table/CategoryTable"
import { categoryInitialFrom, type CategoryFormType } from "../../types/category"
import "../../css/Category.css"


export const Category = () => {
    const [form, setForm] = useState<CategoryFormType>(categoryInitialFrom)
    const [editingId, setEditingId] = useState<string | null>(null)

    return (
        <div className="cp-page">

            {/* Page Header */}
            <div className="cp-header">
                <div className="cp-header-inner">
                    <div className="cp-header-icon">
                        <i className="bi bi-tags-fill" />
                    </div>
                    <div>
                        <h2 className="cp-title">Categories</h2>
                        <p className="cp-subtitle">Manage and organize your product categories</p>
                    </div>
                </div>
                <div className="cp-header-badge">
                    <i className="bi bi-grid-3x3-gap-fill me-1" />
                    Catalog
                </div>
            </div>

            {/* Content */}
            <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-5">
                    <CategoryForm
                        form={form}
                        setForm={setForm}
                        editingId={editingId}
                        setEditingId={setEditingId}
                    />
                </div>
                <div className="col-12 col-lg-7">
                    <CategoryTable
                        form={form}
                        setForm={setForm}
                        editingId={editingId}
                        setEditingId={setEditingId}
                    />
                </div>
            </div>

        </div>
    )
}