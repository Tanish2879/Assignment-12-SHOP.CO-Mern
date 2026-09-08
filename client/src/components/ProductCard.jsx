import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const ProductCard = (props) => {
  const product = props.product || props;
  const id = product._id || product.id || "";
  const name = product.name || product.title || "";
  const image = product.image || product.imageUrl || "";
  const price = product.price || 0;
  const originalPrice = product.originalPrice;
  const discount = product.discount || product.discountPercentage;
  const rating = product.rating || 0;

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-card__image-link">
        <div className="product-card__image-wrapper">
          <img src={image} alt={name} className="product-card__image" />
        </div>
      </Link>

      <div className="product-card__content">
        <Link to={`/product/${id}`} className="product-card__title-link">
          <h3 className="product-card__title">{name}</h3>
        </Link>

        <div className="product-card__rating">
          <StarRating rating={rating} />
        </div>

        <div className="product-card__price-container">
          <span className="product-card__current-price">${price}</span>
          {originalPrice && (
            <span className="product-card__original-price">${originalPrice}</span>
          )}
          {discount && (
            <span className="product-card__discount-badge">
              {typeof discount === "number" ? `-${discount}%` : discount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;