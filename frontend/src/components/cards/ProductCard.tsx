import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/ProductCard.css";

type StockStatus = "in-stock" | "low" | "out";
type BadgeType = "OTC" | "Rx";

type ProductCardProps = {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  badge?: BadgeType;
  stock?: StockStatus;
  onAdd?: () => void;
  onWishList?: () => void;
};

export const ProductCard = ({
  name,
  category,
  price,
  originalPrice,
  image,
  badge = "OTC",
  stock = "in-stock",
  onAdd,
  onWishList,
}: ProductCardProps) => {
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlist = () => {
    setWishlisted((prev) => !prev);
    onWishList?.();
  };

  return (
    <div className="product-card shadow-sm">

      {/* ── Image Section ── */}
      <div className="product-img-wrapper">
        <span className={`badge-pill ${badge === "Rx" ? "rx" : "otc"}`}>
          {badge}
        </span>

        <button className="wishlist-btn" onClick={handleWishlist}>
          <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
        </button>

        <div className="product-img">
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <div className="placeholder">💊</div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="product-body">
        <small className="category">{category}</small>
        <h6 className="name">{name}</h6>

        <div className="price">
          <span className="current">₱{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="old">₱{originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="product-footer">
        <span className={`stock ${stock}`}>
          {stock === "in-stock" && "In stock"}
          {stock === "low" && "Low stock"}
          {stock === "out" && "Out of stock"}
        </span>

        <button
          className="add-btn"
          disabled={stock === "out"}
          onClick={onAdd}
        >
          <i className="bi bi-cart-plus" /> Add
        </button>
      </div>
    </div>
  );
};