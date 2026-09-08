import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

// Static product asset imports for initial display
import p1 from "../assets/images/products/product1.png";
import p2 from "../assets/images/products/product2.png";
import p3 from "../assets/images/products/product3.png";
import p4 from "../assets/images/products/product4.png";
import p5 from "../assets/images/products/product5.png";
import p6 from "../assets/images/products/product6.png";
import p7 from "../assets/images/products/product7.png";
import p8 from "../assets/images/products/product8.png";
import p9 from "../assets/images/products/product 9.png";

const staticProducts = [
  {
    id: "1",
    name: "Gradient Graphic T-shirt",
    image: p1,
    rating: 3.5,
    price: 145
  },
  {
    id: "2",
    name: "Polo with Tipping Details",
    image: p2,
    rating: 4.5,
    price: 180
  },
  {
    id: "3",
    name: "Black Striped T-shirt",
    image: p3,
    rating: 5.0,
    price: 120,
    originalPrice: 150,
    discount: 30
  },
  {
    id: "4",
    name: "Skinny Fit Jeans",
    image: p4,
    rating: 3.5,
    price: 240,
    originalPrice: 260,
    discount: 20
  },
  {
    id: "5",
    name: "Checkered Shirt",
    image: p5,
    rating: 4.5,
    price: 180
  },
  {
    id: "6",
    name: "Sleeve Striped T-shirt",
    image: p6,
    rating: 4.5,
    price: 130,
    originalPrice: 160,
    discount: 30
  },
  {
    id: "7",
    name: "Vertical Striped Shirt",
    image: p7,
    rating: 5.0,
    price: 212,
    originalPrice: 232,
    discount: 20
  },
  {
    id: "8",
    name: "Courage Graphic T-shirt",
    image: p8,
    rating: 4.0,
    price: 145
  },
  {
    id: "9",
    name: "Loose Fit Bermuda Shorts",
    image: p9,
    rating: 3.0,
    price: 80
  }
];

const Category = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Static for now, will be populated from API later
  const products = staticProducts;
  const categoryTitle = "Casual";
  const totalProducts = 100;
  const currentPage = 1;
  const totalPages = 10;

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: categoryTitle }
  ];

  return (
    <main className="category-page">
      <div className="category-page__container">
        {/* Breadcrumb Navigation */}
        <div className="category-page__breadcrumbs-wrapper">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="category-page__layout">
          {/* Filter Sidebar (Desktop & Mobile Drawer) */}
          <div className="category-page__sidebar-wrapper">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Product Listing Main Content */}
          <section className="category-page__content">
            {/* Header & Controls Toolbar */}
            <div className="category-page__header">
              <h1 className="category-page__title">{categoryTitle}</h1>

              <div className="category-page__toolbar">
                <p className="category-page__count">
                  Showing 1-10 of {totalProducts} Products
                </p>

                <div className="category-page__sort">
                  <span>Sort by:</span>
                  <select className="category-page__sort-select" defaultValue="popular">
                    <option value="popular">Most Popular</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  className="category-page__filter-btn"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  aria-label="Toggle Filters"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dynamic Products Grid */}
            <div className="category-page__grid">
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product._id || product.id || index}
                    product={product}
                  />
                ))
              ) : (
                <p className="category-page__empty">No products found</p>
              )}
            </div>

            {/* Pagination */}
            <div className="category-page__pagination-wrapper">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Category;
