import { useEffect, useState } from "react"
import { ProductForm } from "../../components/forms/ProductForm"
import { ProductTable } from "../../components/table/ProductTable"
import { productInitialForm, type ProductFormType } from "../../types/product"
import "../../css/Product.css"
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct"

export const Product = () => {
  const [form, setForm] = useState<ProductFormType>(productInitialForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { getAllProduct } = useGetAllProduct()

   useEffect(() => {
    getAllProduct();
  }, []);

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

      {/* Main layout */}
      <div className="row g-4 align-items-start">
        {/* Form column */}
        <div className="col-12 col-lg-4">
          {/* Sticky on desktop so form stays visible while scrolling the table */}
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
        <div className="col-12 col-lg-8">
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