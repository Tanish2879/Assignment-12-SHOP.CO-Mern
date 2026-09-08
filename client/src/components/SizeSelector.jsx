
const SizeSelector = ({
  sizes = ["Small", "Medium", "Large", "X-Large"],
  selectedSize,
  onSelectSize,
  title = "Choose Size"
}) => {
  return (
    <div className="size-selector">
      {title && <span className="size-selector__title">{title}</span>}
      <div className="size-selector__options">
        {sizes.map((size, index) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={index}
              type="button"
              className={`size-selector__btn ${isSelected ? "size-selector__btn--active" : ""}`}
              onClick={() => onSelectSize && onSelectSize(size)}
              aria-label={`Select size ${size}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
