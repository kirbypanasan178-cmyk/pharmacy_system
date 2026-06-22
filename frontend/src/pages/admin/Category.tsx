import { useEffect, useState } from "react"
import { CategoryForm } from "../../components/forms/CategoryForm"
import { CategoryTable } from "../../components/table/CategoryTable"
import { categoryInitialFrom, type CategoryFormType } from "../../types/category"
import { useGetAllCategory } from "../../hooks/category/useGetAllCategory"
import { useAppSelector } from "../../hooks/redux/reduxHooks"

export const Category = () => {
    const [form, setForm] = useState<CategoryFormType>(categoryInitialFrom)
    const [editingId, setEditingId] = useState<string | null>(null)

    const { getAllCategory } = useGetAllCategory()
    const categories = useAppSelector((state) => state.category.categories)

    useEffect(() => {
        getAllCategory()
    }, [])

   
    /* ── shared token ── */
    const cardStyle: React.CSSProperties = {
        backgroundColor: "#fff",
        border: "1px solid #e4ece4",
        borderRadius: 10,
        overflow: "hidden",
    }

    const cardHeaderStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        borderBottom: "1px solid #eef4ee",
        backgroundColor: "#fafcfa",
    }

    const cardTitleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#1a2e1a",
        display: "flex",
        alignItems: "center",
        gap: 8,
    }

    const badgeStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: "0.72rem",
        fontWeight: 600,
        color: "#1a7a4a",
        backgroundColor: "#e8f5ee",
        border: "1px solid #c3dfc9",
        borderRadius: 20,
        padding: "3px 10px",
    }

    return (
        <div style={{ padding: "28px 24px", maxWidth: 1200 }}>

            {/* Page Header */}
            <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-3">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: "#e8f5ee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1a7a4a",
                            fontSize: "1.1rem",
                        }}
                    >
                        <i className="bi bi-tags-fill" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1a2e1a" }}>
                            Category Management
                        </h2>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b826b" }}>
                            Manage and organize your product categories
                        </p>
                    </div>
                </div>
                <span style={badgeStyle}>
                    <i className="bi bi-grid-3x3-gap-fill" />
                    Catalog
                </span>
            </div>

            <hr style={{ borderColor: "#eef4ee", margin: "18px 0 22px" }} />

            {/* Content Row */}
            <div className="row g-4">

                {/* Form Column */}
                <div className="col-12 col-lg-4">
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <p style={cardTitleStyle}>
                                <i className={`bi ${editingId ? "bi-pencil-square" : "bi-plus-circle-fill"}`}
                                    style={{ color: "#1a7a4a" }} />
                                {editingId ? "Edit Category" : "New Category"}
                            </p>
                            {editingId && (
                                <span style={{ ...badgeStyle, fontSize: "0.68rem", padding: "2px 9px" }}>
                                    <i className="bi bi-pencil" />
                                    Editing
                                </span>
                            )}
                        </div>
                        <div style={{ padding: "18px" }}>
                            <CategoryForm
                                form={form}
                                setForm={setForm}
                                editingId={editingId}
                                setEditingId={setEditingId}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Column */}
                <div className="col-12 col-lg-8">
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <p style={cardTitleStyle}>
                                <i className="bi bi-table" style={{ color: "#1a7a4a" }} />
                                All Categories
                            </p>
                            <span style={badgeStyle}>
                                {categories.length} {categories.length === 1 ? "item" : "items"}
                            </span>
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