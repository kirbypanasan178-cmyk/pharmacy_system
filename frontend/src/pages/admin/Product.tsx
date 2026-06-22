import { useEffect, useState } from "react"
import { ProductForm } from "../../components/forms/ProductForm"
import { ProductTable } from "../../components/table/ProductTable"
import { productInitialForm, type ProductFormType } from "../../types/product"
import "../../css/Product.css"
import { useGetAllCategory } from "../../hooks/category/useGetAllCategory"
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct"

export const Product = () => {
  const [form, setForm] = useState<ProductFormType>(productInitialForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { getAllCategory } = useGetAllCategory()
  const { getAllProduct } = useGetAllProduct()

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllCategory(), getAllProduct()])
    }
    fetchData()
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", padding: "2rem 2rem 3rem" }}>

      {/* Page header */}
      <div className="mb-3 flex-shrink-0">
        <h1
          style={{
            fontFamily: "sans-serif",
            fontWeight: 600,
            fontSize: "1.75rem",
            color: "var(--c-text)",
            letterSpacing: "-0.5px",
            marginBottom: 4,
          }}
        >
          Product Management
        </h1>
        <p style={{ color: "var(--c-muted)", fontSize: "0.875rem", margin: 0 }}>
          Manage your pharmacy inventory — add, edit, or remove products.
        </p>
      </div>

      {/* Main layout */}
      <div className="row g-4 flex-grow-1" style={{ minHeight: 0 }}>

        {/* Form column */}
        <div className="col-12 col-xl-4 col-lg-6 h-100 overflow-y-auto">
          <ProductForm
            editingId={editingId}
            setEditingId={setEditingId}
            form={form}
            setForm={setForm}
          />
        </div>

        {/* Table column */}
        <div className="col-12 col-xl-8 col-lg-6 h-100 overflow-y-auto">
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