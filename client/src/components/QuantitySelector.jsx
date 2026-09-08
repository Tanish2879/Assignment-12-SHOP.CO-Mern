
const QuantitySelector = ({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`quantity-selector ${className}`}>
      <button
        type="button"
        className="quantity-selector__btn quantity-selector__btn--decrease"
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="quantity-selector__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="quantity-selector__btn quantity-selector__btn--increase"
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
