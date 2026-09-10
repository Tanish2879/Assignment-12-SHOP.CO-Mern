import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartContext";
import Breadcrumbs from "../components/Breadcrumbs";
import StarRating from "../components/StarRating";
import ColorSelector from "../components/ColorSelector";
import SizeSelector from "../components/SizeSelector";
import QuantitySelector from "../components/QuantitySelector";
import ReviewCard from "../components/ReviewCard";
import ProductCard from "../components/ProductCard";
import Newsletter from "../components/Newsletter";

const defaultReviews = [
  {
    _id: "r1",
    name: "Samantha D.",
    rating: 4.5,
    isVerified: true,
    comment:
      "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    date: "Posted on August 14, 2023"
  },
  {
    _id: "r2",
    name: "Alex M.",
    rating: 4.0,
    isVerified: true,
    comment:
      "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this shirt definitely gets a thumbs up from me.",
    date: "Posted on August 15, 2023"
  },
  {
    _id: "r3",
    name: "Ethan R.",
    rating: 3.5,
    isVerified: true,
    comment:
      "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of it.",
    date: "Posted on August 16, 2023"
  },
  {
    _id: "r4",
    name: "Olivia P.",
    rating: 4.5,
    isVerified: true,
    comment:
      "As a UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
    date: "Posted on August 17, 2023"
  },
  {
    _id: "r5",
    name: "Liam K.",
    rating: 4.0,
    isVerified: true,
    comment:
      "This t-shirt is a fusion of comfort and the latest trend. The fabric is breathable and the fit is just right. It's quickly become my favorite piece for everyday casual outings.",
    date: "Posted on August 18, 2023"
  },
  {
    _id: "r6",
    name: "Ava H.",
    rating: 4.5,
    isVerified: true,
    comment:
      "I'm not usually one to leave reviews, but this t-shirt completely blew me away. The attention to detail from the stitching to the print quality is top tier.",
    date: "Posted on August 19, 2023"
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  // Fetch product from backend API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/product/get-product/${id}`);
        if (res.data?.success && res.data.product) {
          const p = res.data.product;
          setProduct(p);
          setSelectedColor(p.colors?.[0] || "Default");
          setSelectedSize(p.sizes?.[0] || "Large");

          // Fetch related products
          if (p.category?._id) {
            fetchRelated(p._id, p.category._id);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching single product:", err);
        setError("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (pid, cid) => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/product/related-product/${pid}/${cid}`);
        if (res.data?.success) {
          setRelatedProducts(res.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.quantity <= 0) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-page__container product-detail-page__status-container">
          <h2>Loading product details...</h2>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-page__container product-detail-page__status-container">
          <h2>{error || "Product not found"}</h2>
          <Link to="/shop" className="product-detail-page__back-link">
            ← Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.quantity <= 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;
  const photoUrl = `http://localhost:8000/api/v1/product/get-product-photo/${product._id}`;

  console.log(photoUrl);
  

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Men", path: "/shop" },
    { label: product.category?.name || "T-shirts", path: `/shop?category=${product.category?.name || ""}` }
  ];

  const colorOptions = product.colors && product.colors.length > 0
    ? product.colors.map((c) => ({
        name: c,
        hex: c.toLowerCase() === "olive" ? "#4F4631" : c.toLowerCase() === "forest" || c.toLowerCase() === "green" ? "#314F4A" : c.toLowerCase() === "navy" || c.toLowerCase() === "blue" ? "#31344F" : c
      }))
    : [
        { name: "Olive", hex: "#4F4631" },
        { name: "Forest", hex: "#314F4A" },
        { name: "Navy", hex: "#31344F" }
      ];

  const sizeOptions = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ["Small", "Medium", "Large", "X-Large"];

  return (
    <main className="product-detail-page"> 
      <div className="product-detail-page__container">
        {/* Breadcrumb Navigation */}
        <div className="product-detail-page__breadcrumbs-wrapper">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Product Hero (Gallery + Info) */}
        <section className="product-detail-page__hero">
          {/* Gallery Section with 3 Thumbnails matching Figma */}
          <div className="product-detail-page__gallery">
            <div className="product-detail-page__thumbnails">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-detail-page__thumb-btn ${activeThumb === idx ? "product-detail-page__thumb-btn--active" : ""}`}
                  onClick={() => setActiveThumb(idx)}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img src={photoUrl} alt="" />
                </button>
              ))}
            </div>

            <div className="product-detail-page__main-image-wrapper">
              <img
                src={photoUrl}
                alt={product.name}
                className="product-detail-page__main-image"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-detail-page__info">
            <h1 className="product-detail-page__title">{product.name}</h1>

            <div className="product-detail-page__rating">
              <StarRating rating={typeof product.rating === "number" ? product.rating : (product.rating ? Number(product.rating) : 4.5)} size={20} />
            </div>

            <div className="product-detail-page__price-container">
              <span className="product-detail-page__current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="product-detail-page__original-price">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="product-detail-page__discount-badge">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div>
              {isOutOfStock ? (
                <span className="product-detail-page__stock-status product-detail-page__stock-status--out">
                  ● OUT OF STOCK
                </span>
              ) : isLowStock ? (
                <span className="product-detail-page__stock-status product-detail-page__stock-status--low">
                  ● Only {product.quantity} left in stock!
                </span>
              ) : (
                <span className="product-detail-page__stock-status product-detail-page__stock-status--in">
                  ● In Stock ({product.quantity} available)
                </span>
              )}
            </div>

            <p className="product-detail-page__description">{product.description}</p>

            <hr className="product-detail-page__divider" />

            {/* Colors */}
            <ColorSelector
              title="Select Colors"
              colors={colorOptions}
              selectedColor={selectedColor}
              onSelectColor={(color) => setSelectedColor(color.name)}
            />

            <hr className="product-detail-page__divider" />

            {/* Sizes */}
            <SizeSelector
              title="Choose Size"
              sizes={sizeOptions}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size)}
            />

            <hr className="product-detail-page__divider" />

            {/* Added to cart notification */}
            {addedNotice && (
              <div className="product-detail-page__added-notice">
                ✓ Added to cart successfully! <Link to="/cart" className="product-detail-page__added-notice-link">View Cart</Link>
              </div>
            )}

            /* Quantity and Add to Cart */
            <div className="product-detail-page__actions">
              <QuantitySelector
                quantity={quantity}
                min={1}
                max={product.quantity || 99}
                disabled={isOutOfStock}
                onIncrease={() => setQuantity((q) => (q < (product.quantity || 99) ? q + 1 : q))}
                onDecrease={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              />

              <button
                type="button"
                className="product-detail-page__add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </section>

        /* Tabs Section matching Figma */
        <section className="product-detail-page__tabs-section">
          <div className="product-detail-page__tabs-header">
            <button
              type="button"
              className={`product-detail-page__tab-btn ${activeTab === "details" ? "product-detail-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Product Details
            </button>
            <button
              type="button"
              className={`product-detail-page__tab-btn ${activeTab === "reviews" ? "product-detail-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Rating & Reviews
            </button>
            <button
              type="button"
              className={`product-detail-page__tab-btn ${activeTab === "faqs" ? "product-detail-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("faqs")}
            >
              FAQs
            </button>
          </div>

          /* Reviews Tab */
          {activeTab === "reviews" && (
            <div className="product-detail-page__reviews-tab">
              <div className="product-detail-page__reviews-toolbar">
                <h3 className="product-detail-page__reviews-title">
                  All Reviews <span>(451)</span>
                </h3>

                <div className="product-detail-page__reviews-actions">
                  <button type="button" className="product-detail-page__filter-icon-btn" aria-label="Filter reviews">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                  </button>

                  <button type="button" className="product-detail-page__write-review-btn">
                    Write a Review
                  </button>
                </div>
              </div>

              <div className="product-detail-page__reviews-grid">
                {defaultReviews.map((rev) => (
                  <ReviewCard
                    key={rev._id}
                    name={rev.name}
                    rating={rev.rating}
                    isVerified={rev.isVerified}
                    comment={rev.comment}
                    date={rev.date}
                  />
                ))}
              </div>

              <button type="button" className="product-detail-page__load-more-btn">
                Load More Reviews
              </button>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="product-detail-page__tab-content">
              <p><strong>Category:</strong> {product.category?.name || "Apparel"}</p>
              <p><strong>Style:</strong> {product.dressStyle || "Casual"}</p>
              <p><strong>Shipping:</strong> {product.shipping ? "Free Standard Shipping Available" : "Standard Delivery"}</p>
              <p><strong>Care:</strong> Machine wash cold with like colors, tumble dry low.</p>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === "faqs" && (
            <div className="product-detail-page__tab-content">
              <p>
                <strong>Q: How long does shipping take?</strong>
                <br />
                A: Standard shipping takes 3-5 business days.
              </p>
              <p>
                <strong>Q: What is the return policy?</strong>
                <br />
                A: We offer a 30-day money-back guarantee on unworn items.
              </p>
            </div>
          )}
        </section>

        {/* You Might Also Like Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="product-detail-page__related">
            <h2 className="product-detail-page__related-title">YOU MIGHT ALSO LIKE</h2>
            <div className="product-section__grid">
              {relatedProducts.slice(0, 4).map((relProd) => (
                <ProductCard key={relProd._id} product={relProd} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Newsletter/>
    </main>
  );
};

export default ProductDetail;
