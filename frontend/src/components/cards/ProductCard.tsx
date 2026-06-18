import "bootstrap-icons/font/bootstrap-icons.css";
import "../../css/ProductCard.css";

type ProductCardProps = {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  stockStatus: string;
  stock?: number;
  onAdd?: () => void;
};

export const ProductCard = ({
  name,
  category,
  price,
  originalPrice,
  image,
  stock,
  stockStatus,
  onAdd,
}: ProductCardProps) => {
  const discountPct =
    originalPrice && originalPrice !== price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className="sp-card">

      {/* ── Image ── */}
      <div className="sp-img-wrap">
        <span
          className={`sp-badge ${
            stockStatus === "in-stock"
              ? "in-stock"
              : stockStatus === "low-stock"
              ? "low-stock"
              : "out"
          }`}
        >
          {stockStatus === "in-stock" && "In Stock"}
          {stockStatus === "low-stock" && "Low Stock"}
          {stockStatus === "out" && "Out of Stock"}
        </span>

        <div className="sp-img-inner">
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <div className="sp-img-placeholder">💊</div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="sp-body">
        {category && <span className="sp-category">{category}</span>}
        <h6 className="sp-name">{name}</h6>
        {stock !== undefined && (
          <span className="sp-stock-qty">{stock} items in stock</span>
        )}
        <div className="sp-price-row">
          <span className="sp-price">₱{price.toLocaleString()}</span>
          {originalPrice && originalPrice !== price && (
            <span className="sp-orig">₱{originalPrice.toLocaleString()}</span>
          )}
          {discountPct && (
            <span className="sp-discount">-{discountPct}%</span>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="sp-footer">
        <button
          className="sp-add-btn"
          disabled={stockStatus === "out"}
          onClick={onAdd}
        >
          <i className="bi bi-cart-plus" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};