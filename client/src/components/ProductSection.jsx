import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const ProductSection = ({
  title,
  products = [],
  viewAllLink = "/shop",
  hasDivider = true
}) => {
  return (
    <section className="product-section">
      <div className="product-section__container">
        <h2 className="product-section__title">{title}</h2>

        {/* Dynamic products container */}
        <div className="product-section__grid">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard
                key={product._id || product.id || index}
                product={product}
              />
            ))
          ) : (
            <p className="product-section__empty">No products available</p>
          )}
        </div>

        {viewAllLink && (
          <div className="product-section__action">
            <Link to={viewAllLink} className="product-section__view-all-btn">
              View All
            </Link>
          </div>
        )}

        {hasDivider && <hr className="product-section__divider" />}
      </div>
    </section>
  );
};

export default ProductSection;
