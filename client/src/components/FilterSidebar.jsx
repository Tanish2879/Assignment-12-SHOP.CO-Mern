import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";

const FilterSidebar = ({
  categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"],
  selectedCategory,
  onSelectCategory,
  minPrice = 50,
  maxPrice = 200,
  currentPrice = 120,
  onPriceChange,
  colors = [
    { name: "Green", hex: "#00C12B" },
    { name: "Red", hex: "#F50606" },
    { name: "Yellow", hex: "#F5DD06" },
    { name: "Orange", hex: "#F57906" },
    { name: "Cyan", hex: "#06CAF5" },
    { name: "Blue", hex: "#063AF5" },
    { name: "Purple", hex: "#7D06F5" },
    { name: "Pink", hex: "#F506A4" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#000000" }
  ],
  selectedColor,
  onSelectColor,
  sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"],
  selectedSize,
  onSelectSize,
  dressStyles = ["Casual", "Formal", "Party", "Gym"],
  selectedDressStyle,
  onSelectDressStyle,
  onApplyFilter,
  isOpen = true,
  onClose
}) => {
  return (
    <aside className={`filter-sidebar ${isOpen ? "filter-sidebar--open" : ""}`} aria-label="Product Filters">
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Filters</h3>
        <svg
          className="filter-sidebar__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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

        {onClose && (
          <button type="button" className="filter-sidebar__close-btn" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        )}
      </div>

      <hr className="filter-sidebar__divider" />

      {/* Category List */}
      <div className="filter-sidebar__section">
        <ul className="filter-sidebar__categories-list">
          {categories.map((cat, index) => (
            <li key={index} className="filter-sidebar__category-item">
              <button
                type="button"
                className={`filter-sidebar__category-btn ${selectedCategory === cat ? "filter-sidebar__category-btn--active" : ""}`}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
              >
                <span>{cat}</span>
                <span className="filter-sidebar__arrow">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="filter-sidebar__divider" />

      {/* Price Filter */}
      <div className="filter-sidebar__section">
        <div className="filter-sidebar__section-header">
          <h4 className="filter-sidebar__section-title">Price</h4>
        </div>
        <div className="filter-sidebar__price-wrapper">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={currentPrice}
            onChange={(e) => onPriceChange && onPriceChange(Number(e.target.value))}
            className="filter-sidebar__range-slider"
          />
          <div className="filter-sidebar__price-labels">
            <span>${minPrice}</span>
            <span className="filter-sidebar__current-price">${currentPrice}</span>
            <span>${maxPrice}</span>
          </div>
        </div>
      </div>

      <hr className="filter-sidebar__divider" />

      {/* Colors Filter */}
      <div className="filter-sidebar__section">
        <ColorSelector
          title="Colors"
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onSelectColor}
        />
      </div>

      <hr className="filter-sidebar__divider" />

      {/* Size Filter */}
      <div className="filter-sidebar__section">
        <SizeSelector
          title="Size"
          sizes={sizes}
          selectedSize={selectedSize}
          onSelectSize={onSelectSize}
        />
      </div>

      <hr className="filter-sidebar__divider" />

      {/* Dress Style Filter */}
      <div className="filter-sidebar__section">
        <div className="filter-sidebar__section-header">
          <h4 className="filter-sidebar__section-title">Dress Style</h4>
        </div>
        <ul className="filter-sidebar__categories-list">
          {dressStyles.map((style, index) => (
            <li key={index} className="filter-sidebar__category-item">
              <button
                type="button"
                className={`filter-sidebar__category-btn ${selectedDressStyle === style ? "filter-sidebar__category-btn--active" : ""}`}
                onClick={() => onSelectDressStyle && onSelectDressStyle(style)}
              >
                <span>{style}</span>
                <span className="filter-sidebar__arrow">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="filter-sidebar__apply-btn"
        onClick={() => onApplyFilter && onApplyFilter()}
      >
        Apply Filter
      </button>
    </aside>
  );
};

export default FilterSidebar;
