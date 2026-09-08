import QuantitySelector from "./QuantitySelector";

const CartItem = ({
  id,
  name = "Gradient Graphic T-shirt",
  image,
  size = "Large",
  color = "White",
  price = 145,
  quantity = 1,
  onQuantityChange,
  onRemove
}) => {
  return (
    <article className="cart-item">
      <div className="cart-item__image-wrapper">
        <img src={image} alt={name} className="cart-item__image" />
      </div>

      <div className="cart-item__details">
        <div className="cart-item__header">
          <h3 className="cart-item__name">{name}</h3>
          <button
            type="button"
            className="cart-item__delete-btn"
            onClick={() => onRemove && onRemove(id)}
            aria-label={`Remove ${name} from cart`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff3333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>

        <div className="cart-item__attributes">
          {size && (
            <p className="cart-item__attribute">
              <span className="cart-item__attr-label">Size:</span> {size}
            </p>
          )}
          {color && (
            <p className="cart-item__attribute">
              <span className="cart-item__attr-label">Color:</span> {color}
            </p>
          )}
        </div>

        <div className="cart-item__footer">
          <span className="cart-item__price">${price}</span>

          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onQuantityChange && onQuantityChange(id, quantity + 1)}
            onDecrease={() => onQuantityChange && onQuantityChange(id, Math.max(1, quantity - 1))}
          />
        </div>
      </div>
    </article>
  );
};

export default CartItem;
