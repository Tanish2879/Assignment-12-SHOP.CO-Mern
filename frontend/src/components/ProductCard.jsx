function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__rating">
          <span>★</span>
          <span>{product.rating}/5</span>
        </div>

        <div className="product-card__price">
          <span className="product-card__current-price">
            ${product.price}
          </span>

          {product.originalPrice && (
            <span className="product-card__original-price">
              ${product.originalPrice}
            </span>
          )}

          {product.discount && (
            <span className="product-card__discount">
              {product.discount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;