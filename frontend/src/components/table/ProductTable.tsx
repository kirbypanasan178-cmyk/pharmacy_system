import { useAppSelector } from "../../hooks/redux/reduxHooks";
import type { ProductFormTypeProps } from "../../types/product";
import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import "../../css/ProductTable.css";
import { useProductFilters } from "../../hooks/product/useProductFilters";
import { useMemo } from "react";

const stockStatus = (qty: number) => {
  if (qty === 0) return { cls: "out-of-stock", label: "Out of stock" };
  if (qty <= 5) return { cls: "low-stock", label: `Low (${qty})` };
  return { cls: "in-stock", label: qty.toString() };
};

export const ProductTable = ({
  setEditingId,
  setForm,
  editingId,
}: ProductFormTypeProps) => {
  const products = useAppSelector((state) => state.product.products);
  const { deleteProduct } = useDeleteProduct();

  const { search, setSearch, category, setCategory, filteredProducts } =
    useProductFilters();

  const uniqueCategories = useMemo(
    () => [...new Set(products.map((p) => p.category?.name).filter(Boolean))],
    [products]
  );

  const handleEdit = (prod: any) => {
    setEditingId(prod._id);
    setForm({
      name: prod.name,
      price: prod.price,
      description: prod.description ?? "",
      image: prod.image ?? "",
      category: prod.category,
      stock: prod.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product? This action cannot be undone.")) {
      await deleteProduct(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      name: "",
      price: 0,
      description: "",
      image: null,
      category: "",
      stock: 0,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 12 }}>

      {/* ── Filter bar — static, never scrolls ── */}
      <div className="d-flex flex-wrap gap-2" style={{ alignItems: "center", flexShrink: 0 }}>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--c-muted)",
              fontSize: "0.85rem",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or stock status…"
            style={{
              width: "100%",
              paddingLeft: 32,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              border: "1.5px solid var(--c-border)",
              borderRadius: 8,
              fontSize: "0.85rem",
              color: "var(--c-text)",
              background: "#fff",
              outline: "none",
            }}
          />
        </div>

        {/* Category select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            flex: "0 1 180px",
            padding: "8px 12px",
            border: "1.5px solid var(--c-border)",
            borderRadius: 8,
            fontSize: "0.85rem",
            color: "var(--c-text)",
            background: "#fff",
            outline: "none",
          }}
        >
          <option value="all">All categories</option>
          {uniqueCategories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* ── Card — fills remaining height and scrolls internally ── */}
      <div className="product-table-card">

        {/* Header bar — sticky inside card */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-3"
          style={{ borderBottom: "1.5px solid var(--c-border)", flexShrink: 0 }}
        >
          <div>
            <p className="product-section-title mb-0">Product Inventory</p>
            <p className="product-section-subtitle mb-0">
              {filteredProducts.length} of {products.length} item
              {products.length !== 1 ? "s" : ""}
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
            {category === "all" ? "All categories" : category}
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty">
                      <div className="table-empty-icon">📭</div>
                      <p className="table-empty-text">
                        {products.length === 0
                          ? "No products yet. Create one above!"
                          : "No products match your filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const { cls, label } = stockStatus(product.stock);
                  return (
                    <tr
                      key={product._id}
                      style={{ animationDelay: `${index * 40}ms` }}
                      className={editingId === product._id ? "table-active" : ""}
                    >
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

                      <td>
                        <span className="category-badge">
                          {product.category?.name || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="product-price">
                          ₱
                          {Number(product.price).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      <td>
                        <span className={`stock-pill ${cls}`}>{label}</span>
                      </td>

                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        {!editingId ? (
                          <button
                          className="btn btn-action-edit me-2"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️ Edit
                        </button>
                        ) : (
                           <button
                          className="btn btn-action-edit me-2"
                          onClick={() => handleCancel()}
                        >
                          ❌ Cancel
                        </button>
                        )
                        }
                        
                       
                        <button
                          className="btn btn-action-delete"
                          onClick={() => handleDelete(product._id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};