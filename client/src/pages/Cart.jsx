import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import Breadcrumbs from "../components/Breadcrumbs";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import Newsletter from "../components/Newsletter";

const Cart = () => {
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Checkout modal & state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    fullName: auth?.user?.name || "",
    email: auth?.user?.email || "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    paymentMethod: "Cash on Delivery"
  });

  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const discountAmount = Math.round(((subtotal * discountPercentage) / 100) * 100) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Coupon validation via backend API
  const handleApplyPromo = async (code) => {
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await axios.post("http://localhost:8000/api/v1/product/validate-coupon", {
        couponCode: code,
        subtotal
      });

      if (res.data?.success) {
        setAppliedCoupon(res.data.couponCode);
        setDiscountPercentage(res.data.discountPercent || res.data.discountPercentage || 0);
        setCouponSuccess(`Coupon ${res.data.couponCode} applied successfully! (${res.data.discountPercent || res.data.discountPercentage}% OFF)`);
      } else {
        setCouponError(res.data?.message || "Invalid coupon code");
      }
    } catch (err) {
      console.error(err);
      setCouponError(err.response?.data?.message || "Failed to validate coupon");
    }
  };

  // Open shipping & checkout modal
  const handleOpenCheckout = () => {
    if (cartItems.length === 0) return;

    if (!auth?.token) {
      navigate("/login", { state: "/cart" });
      return;
    }

    setShippingForm((prev) => ({
      ...prev,
      fullName: prev.fullName || auth?.user?.name || "",
      email: prev.email || auth?.user?.email || "",
      phone: prev.phone || auth?.user?.phone || "",
      address: prev.address || auth?.user?.address || ""
    }));

    setCheckoutError("");
    setShowCheckoutModal(true);
  };

  // Submit checkout and place order
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const payload = {
        cartItems: cartItems.map((item) => {
          const prodId = item._id || item.id || item.product;
          return {
            _id: prodId,
            id: prodId,
            product: prodId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || "Default",
            color: item.color || "Default"
          };
        }),
        couponCode: appliedCoupon || undefined,
        shippingAddress: {
          fullName: shippingForm.fullName,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.postalCode,
          country: shippingForm.country,
          paymentMethod: shippingForm.paymentMethod
        }
      };

      const res = await axios.post("http://localhost:8000/api/v1/product/order-checkout", payload);
      if (res.data?.success) {
        setPlacedOrder(res.data.order);
        clearCart();
        setShowCheckoutModal(false);
      } else {
        setCheckoutError(res.data?.message || "Checkout failed");
      }
    } catch (err) {
      console.error(err);
      setCheckoutError(err.response?.data?.message || err.response?.data?.error || "Checkout error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="cart-page cart-page--confirmation">
        <div className="cart-page__confirmation-card">
          <div className="cart-page__confirmation-icon">
            ✓
          </div>
          <h1 className="cart-page__confirmation-title">
            Order Placed Successfully!
          </h1>
          <p className="cart-page__confirmation-text">
            Order <strong>#{placedOrder._id ? placedOrder._id.slice(-6).toUpperCase() : ""}</strong> has been confirmed.
          </p>

          <div className="cart-page__confirmation-details">
            <div className="cart-page__confirmation-section-title">Delivery Address:</div>
            <div>{placedOrder.shippingAddress?.fullName || auth?.user?.name}</div>
            <div>{placedOrder.shippingAddress?.address}</div>
            <div>{placedOrder.shippingAddress?.city} {placedOrder.shippingAddress?.postalCode}</div>
            <div>Phone: {placedOrder.shippingAddress?.phone || "N/A"}</div>
            <div>Payment: <strong>{placedOrder.shippingAddress?.paymentMethod || "Cash on Delivery"}</strong></div>
            <div className="cart-page__confirmation-total">
              Total Paid: ${placedOrder.finalTotal}
            </div>
          </div>

          <div className="cart-page__confirmation-actions">
            <Link
              to="/orders"
              className="cart-page__confirmation-btn-primary"
            >
              View My Orders
            </Link>

            <Link
              to="/shop"
              className="cart-page__confirmation-btn-secondary"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Cart" }
        ]}
      />

      <h1 className="cart-page__title">YOUR CART</h1>

      {couponSuccess && (
        <div className="cart-page__alert cart-page__alert--success">
          {couponSuccess}
        </div>
      )}

      {couponError && (
        <div className="cart-page__alert cart-page__alert--error">
          {couponError}
        </div>
      )}

      <div className="cart-page__content">
        <div className="cart-page__items-container">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => {
              const prodId = item._id || item.id || item.product;
              return (
                <CartItem
                  key={`${prodId}-${item.size}-${item.color}-${index}`}
                  id={prodId}
                  name={item.name}
                  image={item.image}
                  size={item.size}
                  color={item.color}
                  price={item.price}
                  quantity={item.quantity}
                  maxStock={typeof item.maxStock === "number" ? item.maxStock : 99}
                  onQuantityChange={(id, qty) => updateQuantity(prodId, item.size, item.color, qty)}
                  onRemove={() => removeFromCart(prodId, item.size, item.color)}
                />
              );
            })
          ) : (
            <div className="cart-page__empty-state">
              <p className="cart-page__empty-title">Your shopping cart is empty.</p>
              <Link
                to="/shop"
                className="cart-page__empty-btn"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <OrderSummary
            subtotal={subtotal}
            discountPercentage={discountPercentage}
            deliveryFee={deliveryFee}
            onApplyPromo={handleApplyPromo}
            onCheckout={handleOpenCheckout}
          />
        )}
      </div>

      {/* Shipping Details & Checkout Modal */}
      {showCheckoutModal && (
        <div className="cart-page__modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="cart-page__modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-page__modal-header">
              <h2 className="cart-page__modal-title">Shipping & Checkout</h2>
              <button
                type="button"
                className="cart-page__modal-close"
                onClick={() => setShowCheckoutModal(false)}
              >
                &times;
              </button>
            </div>

            {checkoutError && (
              <div className="cart-page__alert cart-page__alert--error">
                {checkoutError}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="cart-page__form">
              <div className="cart-page__form-row">
                <div className="cart-page__form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="cart-page__form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="cart-page__form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="cart-page__form-row">
                <div className="cart-page__form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>

                <div className="cart-page__form-group">
                  <label>State / Province *</label>
                  <input
                    type="text"
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="cart-page__form-row">
                <div className="cart-page__form-group">
                  <label>Postal / Zip Code *</label>
                  <input
                    type="text"
                    value={shippingForm.postalCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>

                <div className="cart-page__form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    value={shippingForm.country}
                    onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="cart-page__form-group">
                <label>Payment Method</label>
                <div className="cart-page__payment-methods">
                  <label className="cart-page__payment-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={shippingForm.paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setShippingForm({ ...shippingForm, paymentMethod: e.target.value })}
                    />
                    Cash on Delivery
                  </label>

                  <label className="cart-page__payment-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit / Debit Card"
                      checked={shippingForm.paymentMethod === "Credit / Debit Card"}
                      onChange={(e) => setShippingForm({ ...shippingForm, paymentMethod: e.target.value })}
                    />
                    Card / Online
                  </label>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="cart-page__order-summary-box">
                <div className="cart-page__summary-line">
                  <span>Items Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} items):</span>
                  <span>${subtotal}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="cart-page__summary-line cart-page__summary-line--discount">
                    <span>Discount (-{discountPercentage}%):</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="cart-page__summary-line">
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee}</span>
                </div>
                <div className="cart-page__summary-line cart-page__summary-line--total">
                  <span>Total Payable:</span>
                  <span>${finalTotal}</span>
                </div>
              </div>

              <div className="cart-page__form-actions">
                <button
                  type="button"
                  className="cart-page__btn-cancel"
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cart-page__btn-submit"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Processing..." : `Place Order ($${finalTotal})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Newsletter />
    </div>
  );
};

export default Cart;
