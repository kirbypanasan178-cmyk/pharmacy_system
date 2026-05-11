import { useState } from "react"
import { ProductForm } from "../../components/forms/ProductForm"
import { ProductTable } from "../../components/table/ProductTable"
import { productInitialForm, type ProductFormType } from "../../types/product"
import "../../css/Product.css"

export const Product = () => {
  const [form, setForm] = useState<ProductFormType>(productInitialForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="product-page">

      {/* Page header */}
      <div className="mb-4">
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.75rem",
            color: "var(--c-text)",
            letterSpacing: "-0.5px",
            marginBottom: 4,
          }}
        >
          🏥 Product Management
        </h1>
        <p style={{ color: "var(--c-muted)", fontSize: "0.875rem", margin: 0 }}>
          Manage your pharmacy inventory — add, edit, or remove products.
        </p>
      </div>

      {/* Main layout — form gets col-5, table gets col-7 */}
      <div className="row g-4 align-items-start">

        {/* Form column — wider now */}
        <div className="col-12 col-xl-5 col-lg-6">
          <div style={{ position: "sticky", top: "1.5rem" }}>
            <ProductForm
              editingId={editingId}
              setEditingId={setEditingId}
              form={form}
              setForm={setForm}
            />
          </div>
        </div>

        {/* Table column */}
        <div className="col-12 col-xl-7 col-lg-6">
          <ProductTable
            editingId={editingId}
            setEditingId={setEditingId}
            form={form}
            setForm={setForm}
          />
        </div>

      </div>
    </div>
  )
}