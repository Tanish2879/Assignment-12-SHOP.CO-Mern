import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Admin = () => {
  const [auth] = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch admin dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!auth?.token || auth?.user?.role !== 1) return;
      try {
        const res = await axios.get("http://localhost:8000/api/v1/auth/admin-dashboard-stats");
        if (res.data?.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };

    const fetchAllOrders = async () => {
      if (!auth?.token || auth?.user?.role !== 1) return;
      try {
        const res = await axios.get("http://localhost:8000/api/v1/auth/all-orders");
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Error fetching all orders:", err);
      }
    };

    fetchDashboardStats();
    fetchAllOrders();
  }, [auth?.token, auth?.user?.role]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/auth/order-status/${orderId}`, {
        status: newStatus
      });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        {/* Header and Tab Navigation */}
        <div className="admin-page__header">
          <h1 className="admin-page__title">Admin Panel</h1>

          <nav className="admin-page__nav">
            <button
              type="button"
              className={`admin-page__tab-btn ${activeTab === "dashboard" ? "admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`admin-page__tab-btn ${activeTab === "products" ? "admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              type="button"
              className={`admin-page__tab-btn ${activeTab === "categories" ? "admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
            <button
              type="button"
              className={`admin-page__tab-btn ${activeTab === "orders" ? "admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
          </nav>
        </div>

        {/* 1. Dashboard Overview Tab */}
        {activeTab === "dashboard" && (
          <section className="admin-page__section">
            <div className="admin-page__stats-grid">
              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Products</p>
                <h3 className="admin-page__stat-value">{stats.totalProducts}</h3>
              </div>

              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Categories</p>
                <h3 className="admin-page__stat-value">{stats.totalCategories}</h3>
              </div>

              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Orders</p>
                <h3 className="admin-page__stat-value">{stats.totalOrders}</h3>
              </div>

              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Users</p>
                <h3 className="admin-page__stat-value">{stats.totalUsers}</h3>
              </div>

              <div className="admin-page__stat-card admin-page__stat-card--warning">
                <p className="admin-page__stat-label">Low Stock (≤ 5)</p>
                <h3 className="admin-page__stat-value">{stats.lowStockProducts}</h3>
              </div>

              <div className="admin-page__stat-card admin-page__stat-card--alert">
                <p className="admin-page__stat-label">Out of Stock</p>
                <h3 className="admin-page__stat-value">{stats.outOfStockProducts}</h3>
              </div>
            </div>

            {/* Quick Overview Section */}
            <div className="admin-page__card">
              <div className="admin-page__card-header">
                <h2 className="admin-page__card-title">Recent Orders</h2>
              </div>
              <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id}</td>
                        <td>{order.buyer?.name || "Customer"}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalAmount || order.subtotal || 0}</td>
                        <td>
                          <span className={`admin-page__badge admin-page__badge--${order.status === "Delivered" ? "success" : order.status === "Processing" ? "info" : "warning"}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", color: "#666" }}>
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 2. Products Management Tab */}
        {activeTab === "products" && (
          <section className="admin-page__section">
            <div className="admin-page__card">
              <div className="admin-page__card-header">
                <h2 className="admin-page__card-title">Product Management</h2>
                <button type="button" className="admin-page__add-btn">+ Add Product</button>
              </div>

              <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Quantity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#666" }}>
                        Connect to Product Management APIs to view and manage all products.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 3. Category Management Tab */}
        {activeTab === "categories" && (
          <section className="admin-page__section">
            <div className="admin-page__card">
              <div className="admin-page__card-header">
                <h2 className="admin-page__card-title">Category Management</h2>
                <button type="button" className="admin-page__add-btn">+ Add Category</button>
              </div>

              <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center", color: "#666" }}>
                        Connect to Category Management APIs to view and manage all categories.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 4. Orders Management Tab */}
        {activeTab === "orders" && (
          <section className="admin-page__section">
            <div className="admin-page__card">
              <div className="admin-page__card-header">
                <h2 className="admin-page__card-title">Order Management</h2>
              </div>

              <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td><strong>#{order._id}</strong></td>
                        <td>{order.buyer?.name || "Customer"} ({order.buyer?.email})</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalAmount || order.subtotal || 0}</td>
                        <td>
                          <span className={`admin-page__badge admin-page__badge--${order.status === "Delivered" ? "success" : order.status === "Processing" ? "info" : "warning"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select
                            defaultValue={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{ padding: "0.25rem 0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                          >
                            <option value="Not Process">Not Process</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancel">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "#666" }}>
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Admin;
