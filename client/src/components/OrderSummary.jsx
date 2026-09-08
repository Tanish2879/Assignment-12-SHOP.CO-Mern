import { useState } from "react";

const OrderSummary = ({
  subtotal = 565,
  discountPercentage = 20,
  deliveryFee = 15,
  onApplyPromo,
  onCheckout
}) => {
  const [promoCode, setPromoCode] = useState("");

  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const total = subtotal - discountAmount + deliveryFee;

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyPromo && promoCode.trim()) {
      onApplyPromo(promoCode.trim());
    }
  };

  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="order-summary__title">
        Order Summary
      </h2>

      <div className="order-summary__rows">
        <div className="order-summary__row">
          <span className="order-summary__label">Subtotal</span>
          <span className="order-summary__value">${subtotal}</span>
        </div>

        <div className="order-summary__row">
          <span className="order-summary__label">Discount (-{discountPercentage}%)</span>
          <span className="order-summary__value order-summary__value--discount">
            -${discountAmount}
          </span>
        </div>

        <div className="order-summary__row">
          <span className="order-summary__label">Delivery Fee</span>
          <span className="order-summary__value">${deliveryFee}</span>
        </div>

        <hr className="order-summary__divider" />

        <div className="order-summary__row order-summary__row--total">
          <span className="order-summary__label">Total</span>
          <span className="order-summary__value order-summary__value--total">
            ${total}
          </span>
        </div>
      </div>

      <form className="order-summary__promo-form" onSubmit={handleApply}>
        <div className="order-summary__promo-input-wrapper">
          <svg
            className="order-summary__promo-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <input
            type="text"
            placeholder="Add promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="order-summary__promo-input"
            aria-label="Promo code"
          />
        </div>
        <button type="submit" className="order-summary__apply-btn">
          Apply
        </button>
      </form>

      <button
        type="button"
        className="order-summary__checkout-btn"
        onClick={() => onCheckout && onCheckout()}
      >
        Go to Checkout
        <span className="order-summary__checkout-arrow">→</span>
      </button>
    </aside>
  );
};

export default OrderSummary;
