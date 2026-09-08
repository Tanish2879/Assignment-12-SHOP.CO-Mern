import { useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import StarRating from "../components/StarRating";
import ColorSelector from "../components/ColorSelector";
import SizeSelector from "../components/SizeSelector";
import QuantitySelector from "../components/QuantitySelector";
import ReviewCard from "../components/ReviewCard";
import ProductCard from "../components/ProductCard";

// Static mock image assets
import p1 from "../assets/images/products/product1.png";
import p2 from "../assets/images/products/product2.png";
import p3 from "../assets/images/products/product3.png";
import p4 from "../assets/images/products/product4.png";
import p5 from "../assets/images/products/product5.png";
import p6 from "../assets/images/products/product6.png";
import p7 from "../assets/images/products/product7.png";

const mockProduct = {
  _id: "1",
  name: "ONE LIFE GRAPHIC T-SHIRT",
  rating: 4.5,
  price: 260,
  originalPrice: 300,
  discount: 40,
  description:
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
  images: [p1, p2, p3],
  category: "T-shirts",
  colors: [
    { name: "Olive", hex: "#4F4631" },
    { name: "Forest", hex: "#314F4A" },
    { name: "Navy", hex: "#31344F" }
  ],
  sizes: ["Small", "Medium", "Large", "X-Large"],
  stock: 15
};

const mockReviews = [
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
      "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion.",
    date: "Posted on August 18, 2023"
  },
  {
    _id: "r6",
    name: "Ava H.",
    rating: 4.5,
    isVerified: true,
    comment:
      "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    date: "Posted on August 19, 2023"
  }
];

const mockRelatedProducts = [
  {
    _id: "p4",
    name: "Polo with Contrast Trim",
    image: p4,
    rating: 4.0,
    price: 212,
    originalPrice: 242,
    discount: 20
  },
  {
    _id: "p5",
    name: "Gradient Graphic T-shirt",
    image: p5,
    rating: 3.5,
    price: 145
  },
  {
    _id: "p6",
    name: "Polo with Tipping Details",
    image: p6,
    rating: 4.5,
    price: 180
  },
  {
    _id: "p7",
    name: "Black Striped T-shirt",
    image: p7,
    rating: 5.0,
    price: 120,
    originalPrice: 150,
    discount: 30
  }
];

const ProductDetail = () => {
  const { id } = useParams();

  // Dynamic state ready for API data
  const product = mockProduct;
  const reviews = mockReviews;
  const relatedProducts = mockRelatedProducts;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Men", path: "/shop?category=men" },
    { label: product.category || "T-shirts" }
  ];

  return (
    <main className="product-detail-page">
      <div className="product-detail-page__container">
        {/* Breadcrumb Navigation */}
        <div className="product-detail-page__breadcrumbs-wrapper">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Product Hero (Gallery + Info) */}
        <section className="product-detail-page__hero">
          {/* Gallery Section */}
          <div className="product-detail-page__gallery">
            <div className="product-detail-page__thumbnails">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`product-detail-page__thumb-btn ${selectedImage === index ? "product-detail-page__thumb-btn--active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="product-detail-page__main-image-wrapper">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="product-detail-page__main-image"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-detail-page__info">
            <h1 className="product-detail-page__title">{product.name}</h1>

            <div className="product-detail-page__rating">
              <StarRating rating={product.rating} />
            </div>

            <div className="product-detail-page__price-container">
              <span className="product-detail-page__current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="product-detail-page__original-price">${product.originalPrice}</span>
              )}
              {product.discount && (
                <span className="product-detail-page__discount-badge">-{product.discount}%</span>
              )}
            </div>

            <p className="product-detail-page__description">{product.description}</p>

            <hr className="product-detail-page__divider" />

            {/* Colors */}
            <ColorSelector
              title="Select Colors"
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={(color) => setSelectedColor(color.name)}
            />

            <hr className="product-detail-page__divider" />

            {/* Sizes */}
            <SizeSelector
              title="Choose Size"
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size)}
            />

            <hr className="product-detail-page__divider" />

            {/* Quantity and Add to Cart */}
            <div className="product-detail-page__actions">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              />

              <button
                type="button"
                className="product-detail-page__add-to-cart-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
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

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="product-detail-page__reviews-tab">
              <div className="product-detail-page__reviews-toolbar">
                <h3 className="product-detail-page__reviews-title">
                  All Reviews <span>({reviews.length})</span>
                </h3>

                <div className="product-detail-page__reviews-actions">
                  <button type="button" className="product-detail-page__write-review-btn">
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Dynamic Reviews Grid */}
              <div className="product-detail-page__reviews-grid">
                {reviews.map((rev) => (
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
              <p>
                <strong>Material:</strong> 100% Premium Cotton
              </p>
              <p>
                <strong>Fit:</strong> Regular relaxed fit with breathable fabric.
              </p>
              <p>
                <strong>Care:</strong> Machine wash cold with like colors, tumble dry low.
              </p>
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
        <section className="product-detail-page__related">
          <h2 className="product-detail-page__related-title">YOU MIGHT ALSO LIKE</h2>
          <div className="product-section__grid">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
