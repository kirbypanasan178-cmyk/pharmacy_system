import { useEffect } from "react"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import { useGetAllProduct } from "../../hooks/useGetAllProduct"
import type { ProductFormTypeProps } from "../../types/product"
import { useDeleteProduct } from "../../hooks/useDeleteProduct"

const stockStatus = (qty: number) => {
  if (qty === 0) return { cls: "out-of-stock", label: "Out of stock" }
  if (qty <= 5)  return { cls: "low-stock",    label: `Low (${qty})` }
  return               { cls: "in-stock",      label: qty.toString() }
}

export const ProductTable = ({ setEditingId, setForm, editingId }: ProductFormTypeProps) => {
  const products = useAppSelector((state) => state.product.products)
  const { getAllProduct } = useGetAllProduct()
  const { deleteProduct } = useDeleteProduct()

  useEffect(() => {
    getAllProduct()
  }, [])

  const handleEdit = (prod: any) => {
    setEditingId(prod._id)
    setForm({
      name:        prod.name,
      price:       prod.price,
      description: prod.description ?? "",
      image:       prod.image ?? "",
      category:    prod.category,
      stock:       prod.stock,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product? This action cannot be undone.")) {
      await deleteProduct(id)
    }
  }

  return (
    <div className="product-table-card">
      {/* Header bar */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ borderBottom: "1.5px solid var(--c-border)" }}
      >
        <div>
          <p className="product-section-title mb-0">Product Inventory</p>
          <p className="product-section-subtitle mb-0">
            {products.length} item{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--c-muted)",
            background: "var(--c-badge-bg)",
            border: "1px solid var(--c-border)",
            borderRadius: 20,
            padding: "3px 12px",
          }}
        >
          All categories
        </span>
      </div>

      <div className="table-responsive">
        <table className="table product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="table-empty">
                    <div className="table-empty-icon">📭</div>
                    <p className="table-empty-text">No products yet. Create one above!</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const { cls, label } = stockStatus(product.stock)
                return (
                  <tr
                    key={product._id}
                    style={{ animationDelay: `${index * 40}ms` }}
                    className={editingId === product._id ? "table-active" : ""}
                  >
                    {/* Image */}
                    <td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-thumb"
                        />
                      ) : (
                        <div className="product-thumb-placeholder">💊</div>
                      )}
                    </td>

                    {/* Name + description */}
                    <td>
                      <span className="product-name">{product.name}</span>
                      {product.description && (
                        <p
                          className="mb-0 mt-1"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--c-muted)",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.description}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td>
                      <span className="category-badge">
                        {product.category || "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <span className="product-price">
                        ₱{Number(product.price).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Stock */}
                    <td>
                      <span className={`stock-pill ${cls}`}>{label}</span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-action-edit me-2"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-action-delete"
                        onClick={() => handleDelete(product._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}