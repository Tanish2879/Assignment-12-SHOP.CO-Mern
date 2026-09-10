import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Breadcrumbs from "../components/Breadcrumbs";

// Fallback product image
import defaultProductImg from "../assets/images/products/product1.png";

const Orders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth?.token) return;
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/v1/auth/orders");
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Error fetching customer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth?.token]);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Account", path: "/profile" },
    { label: "Orders" }
  ];

  return (
    <main className="account-page">
      <div className="account-page__container">
        {/* Breadcrumb Navigation */}
        <div className="account-page__breadcrumbs-wrapper">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Header & Nav */}
        <div className="account-page__header">
          <h1 className="account-page__title">My Account</h1>

          <nav className="account-page__nav">
            <Link
              to="/profile"
              className="account-page__nav-link"
            >
              Profile Details
            </Link>
            <Link
              to="/orders"
              className="account-page__nav-link account-page__nav-link--active"
            >
              My Orders
            </Link>
          </nav>
        </div>

        {/* Orders List */}
        <div className="account-page__orders-list">
          {loading ? (
            <div className="account-page__card account-page__empty">
              <p>Loading your orders...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="account-page__order-card">
                <div className="account-page__order-header">
                  <div className="account-page__order-meta">
                    <div className="account-page__order-meta-item">
                      <span>Order Placed</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="account-page__order-meta-item">
                      <span>Order ID</span>
                      <span>#{order._id}</span>
                    </div>
                    <div className="account-page__order-meta-item">
                      <span>Total Amount</span>
                      <span>${order.totalAmount || order.subtotal || 0}</span>
                    </div>
                  </div>

                  <span
                    className={`admin-page__badge admin-page__badge--${order.status === "Delivered" ? "success" : order.status === "Processing" ? "info" : "warning"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="account-page__order-body">
                  {order.products?.map((item, idx) => (
                    <div key={idx} className="account-page__order-product">
                      <img
                        src={item.product?.photo ? `http://localhost:8000/api/v1/product/product-photo/${item.product._id}` : defaultProductImg}
                        alt={item.product?.name || "Product"}
                      />
                      <div className="account-page__order-product-info">
                        <h4>{item.product?.name || "Product"}</h4>
                        <p>
                          Quantity: {item.quantity || 1} | Price: ${item.price || item.product?.price}
                        </p>
                      </div>
                      <span className="account-page__order-product-price">
                        ${(item.price || item.product?.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="account-page__card account-page__empty">
              <p>You haven't placed any orders yet.</p>
              <Link to="/shop" className="account-page__empty-link">
                Start Shopping →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Orders;
