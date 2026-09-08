
const ColorSelector = ({
  colors = [
    { name: "Olive", hex: "#4F4631" },
    { name: "Forest", hex: "#314F4A" },
    { name: "Navy", hex: "#31344F" }
  ],
  selectedColor,
  onSelectColor,
  title = "Select Colors"
}) => {
  return (
    <div className="color-selector">
      {title && <span className="color-selector__title">{title}</span>}
      <div className="color-selector__options">
        {colors.map((color, index) => {
          const isSelected = selectedColor === color.hex || selectedColor === color.name;
          return (
            <button
              key={index}
              type="button"
              className={`color-selector__circle ${isSelected ? "color-selector__circle--active" : ""}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => onSelectColor && onSelectColor(color)}
              aria-label={`Select color ${color.name}`}
              title={color.name}
            >
              {isSelected && (
                <svg
                  className="color-selector__check"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
