import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Newsletter from "../components/Newsletter";

const Category = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlStyle = searchParams.get("style");
  const urlSearch = searchParams.get("search");
  const urlFilter = searchParams.get("filter");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "");
  const [currentPrice, setCurrentPrice] = useState(260);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedDressStyle, setSelectedDressStyle] = useState(urlStyle || "");
  const [sortBy, setSortBy] = useState(urlFilter === "new" ? "newest" : "popular");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync filters if URL search params change
  useEffect(() => {
    if (urlCategory !== null && urlCategory !== undefined) {
      setSelectedCategory(urlCategory);
    }
    if (urlStyle !== null && urlStyle !== undefined) {
      setSelectedDressStyle(urlStyle);
    }
    if (urlFilter === "new") {
      setSortBy("newest");
    }
  }, [urlCategory, urlStyle, urlFilter]);

  // Fetch all categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/category/get-category");
        if (res.data?.success) {
          setCategories(res.data.category);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered products
  const fetchFilteredProducts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      // Find category ID if selectedCategory is category name
      let checkedCats = [];
      if (selectedCategory) {
        const matched = categories.find(
          (c) => c.name.toLowerCase() === selectedCategory.toLowerCase() || c.slug === selectedCategory.toLowerCase()
        );
        if (matched) checkedCats.push(matched._id);
      }

      const trimmedKeyword = urlSearch && typeof urlSearch === "string" ? urlSearch.trim() : "";

      const payload = {
        keyword: trimmedKeyword || undefined,
        checked: checkedCats,
        radio: [0, currentPrice],
        colors: selectedColor ? [selectedColor] : [],
        sizes: selectedSize ? [selectedSize] : [],
        dressStyle: selectedDressStyle || undefined,
        sortBy: sortBy === "low-high" ? "price-low" : sortBy === "high-low" ? "price-high" : sortBy === "newest" ? "newest" : "popular",
        page: pageNumber,
        limit: 9
      };

      const res = await axios.post("http://localhost:8000/api/v1/product/product-filter", payload);
      if (res.data?.success) {
        setProducts(res.data.products || []);
        setTotalCount(res.data.totalCount || res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(pageNumber);
      }
    } catch (err) {
      console.error("Error fetching filtered products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts(1);
  }, [selectedCategory, currentPrice, selectedColor, selectedSize, selectedDressStyle, sortBy, categories, urlSearch]);

  const handlePageChange = (page) => {
    fetchFilteredProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: urlSearch ? `Search: "${urlSearch}"` : selectedCategory || selectedDressStyle || "Shop" }
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
              categories={categories.map((c) => c.name)}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat === selectedCategory ? "" : cat)}
              minPrice={0}
              maxPrice={300}
              currentPrice={currentPrice}
              onPriceChange={(val) => setCurrentPrice(val)}
              selectedColor={selectedColor}
              onSelectColor={(color) => setSelectedColor(color.name === selectedColor ? "" : color.name)}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size === selectedSize ? "" : size)}
              selectedDressStyle={selectedDressStyle}
              onSelectDressStyle={(style) => setSelectedDressStyle(style === selectedDressStyle ? "" : style)}
              onApplyFilter={() => fetchFilteredProducts(1)}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Product Listing Main Content */}
          <section className="category-page__content">
            {/* Header & Controls Toolbar */}
            <div className="category-page__header">
              <h1 className="category-page__title">
                {selectedCategory || selectedDressStyle || "Casual"}
              </h1>

              <div className="category-page__toolbar">
                <p className="category-page__count">
                  Showing {products.length > 0 ? (currentPage - 1) * 9 + 1 : 0}-
                  {Math.min(currentPage * 9, totalCount)} of {totalCount} Products
                </p>

                <div className="category-page__sort">
                  <span>Sort by:</span>
                  <select
                    className="category-page__sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
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
              {loading ? (
                <div className="category-page__empty">Loading products...</div>
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="category-page__empty">No products matched your filters.</div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="category-page__pagination-wrapper">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </section>
        </div>
      </div>
      <Newsletter/>
    </main>
  );
};

export default Category;
