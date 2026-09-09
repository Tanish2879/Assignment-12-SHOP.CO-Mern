import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Admin = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login", { replace: true });
    } else if (auth?.user?.role !== 1) {
      navigate("/", { replace: true });
    }
  }, [auth?.token, auth?.user?.role, navigate]);

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0
  });

  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: "", text: "" });

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    quantity: "",
    colors: "",
    sizes: "",
    dressStyle: "Casual",
    photo: null
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const showNotification = (type, text) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg({ type: "", text: "" });
    }, 4000);
  };

  // Fetch all initial admin data
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

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/product/get-product");
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/category/get-category");
      if (res.data?.success) {
        setCategories(res.data.category || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchAllOrders();
    fetchAllProducts();
    fetchAllCategories();
  }, [auth?.token, auth?.user?.role]);

  // Order status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/auth/order-status/${orderId}`, {
        status: newStatus
      });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
        showNotification("success", `Order #${orderId.slice(-6)} updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      showNotification("error", "Failed to update order status");
    }
  };

  // Product CRUD
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: categories.length > 0 ? categories[0]._id : "",
      quantity: "",
      colors: "Black, White, Blue",
      sizes: "S, M, L, XL",
      dressStyle: "Casual",
      photo: null
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      category: product.category?._id || product.category || "",
      quantity: product.quantity !== undefined ? product.quantity : "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizes || "",
      dressStyle: product.dressStyle || "Casual",
      photo: null
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price);
      if (productForm.originalPrice) formData.append("originalPrice", productForm.originalPrice);
      formData.append("category", productForm.category);
      formData.append("quantity", productForm.quantity);
      formData.append("colors", productForm.colors);
      formData.append("sizes", productForm.sizes);
      formData.append("dressStyle", productForm.dressStyle);
      if (productForm.photo) formData.append("photo", productForm.photo);

      if (editingProduct) {
        // Update product
        const res = await axios.put(
          `http://localhost:8000/api/v1/product/update-product/${editingProduct._id}`,
          formData
        );
        if (res.data?.success) {
          showNotification("success", "Product updated successfully!");
          setShowProductModal(false);
          fetchAllProducts();
          fetchDashboardStats();
        }
      } else {
        // Create product
        const res = await axios.post(
          "http://localhost:8000/api/v1/product/create-product",
          formData
        );
        if (res.data?.success) {
          showNotification("success", "Product created successfully!");
          setShowProductModal(false);
          fetchAllProducts();
          fetchDashboardStats();
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
      showNotification("error", err.response?.data?.error || "Error saving product");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/product/delete-product/${id}`);
      if (res.data?.success) {
        showNotification("success", "Product deleted successfully!");
        setProducts((prev) => prev.filter((p) => p._id !== id));
        fetchDashboardStats();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      showNotification("error", "Failed to delete product");
    }
  };

  // Category CRUD
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name || "");
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        const res = await axios.put(
          `http://localhost:8000/api/v1/category/update-category/${editingCategory._id}`,
          { name: categoryName.trim() }
        );
        if (res.data?.success) {
          showNotification("success", "Category updated successfully!");
          setShowCategoryModal(false);
          fetchAllCategories();
          fetchDashboardStats();
        }
      } else {
        const res = await axios.post("http://localhost:8000/api/v1/category/create-category", {
          name: categoryName.trim()
        });
        if (res.data?.success) {
          showNotification("success", "Category created successfully!");
          setShowCategoryModal(false);
          fetchAllCategories();
          fetchDashboardStats();
        }
      }
    } catch (err) {
      console.error("Error saving category:", err);
      showNotification("error", "Error saving category");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/category/delete-category/${id}`);
      if (res.data?.success) {
        showNotification("success", "Category deleted successfully!");
        setCategories((prev) => prev.filter((c) => c._id !== id));
        fetchDashboardStats();
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      showNotification("error", "Failed to delete category");
    }
  };

  if (!auth?.token || auth?.user?.role !== 1) {
    return null;
  }

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        {/* Toast / Notification */}
        {feedbackMsg.text && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              marginBottom: "1.5rem",
              borderRadius: "8px",
              backgroundColor: feedbackMsg.type === "success" ? "#d4edda" : "#f8d7da",
              color: feedbackMsg.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${feedbackMsg.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
            }}
          >
            {feedbackMsg.text}
          </div>
        )}

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
              Products ({products.length})
            </button>
            <button
              type="button"
              className={`admin-page__tab-btn ${activeTab === "categories" ? "admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              Categories ({categories.length})
            </button>
            <button
              type="button"
              className={`admin-page__tab-btn ${activeTab === "orders" ? "admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders ({orders.length})
            </button>
          </nav>
        </div>

        {/* 1. Dashboard Overview Tab */}
        {activeTab === "dashboard" && (
          <section className="admin-page__section">
            <div className="admin-page__stats-grid">
              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Products</p>
                <h3 className="admin-page__stat-value">{stats.totalProducts || products.length}</h3>
              </div>

              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Categories</p>
                <h3 className="admin-page__stat-value">{stats.totalCategories || categories.length}</h3>
              </div>

              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Orders</p>
                <h3 className="admin-page__stat-value">{stats.totalOrders || orders.length}</h3>
              </div>

              <div className="admin-page__stat-card">
                <p className="admin-page__stat-label">Total Users</p>
                <h3 className="admin-page__stat-value">{stats.totalUsers || 2}</h3>
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
                        <td><strong>#{order._id.slice(-6).toUpperCase()}</strong></td>
                        <td>{order.buyer?.name || "Customer"}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.finalTotal || order.subtotal || 0}</td>
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
                <button
                  type="button"
                  className="admin-page__add-btn"
                  onClick={openAddProductModal}
                >
                  + Add Product
                </button>
              </div>

              <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Quantity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={`http://localhost:8000/api/v1/product/get-product-photo/${product._id}`}
                              alt={product.name}
                              className="admin-page__product-thumb"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <strong>{product.name}</strong>
                          </div>
                        </td>
                        <td>{product.category?.name || "General"}</td>
                        <td>${product.price}</td>
                        <td>{product.quantity} units</td>
                        <td>
                          {product.quantity <= 0 ? (
                            <span className="admin-page__badge admin-page__badge--danger">Out of Stock</span>
                          ) : product.quantity <= 5 ? (
                            <span className="admin-page__badge admin-page__badge--warning">Low Stock ({product.quantity})</span>
                          ) : (
                            <span className="admin-page__badge admin-page__badge--success">In Stock</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              type="button"
                              className="admin-page__action-btn admin-page__action-btn--edit"
                              onClick={() => openEditProductModal(product)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-page__action-btn admin-page__action-btn--delete"
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "#666" }}>
                          No products found. Click "+ Add Product" to create one.
                        </td>
                      </tr>
                    )}
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
                <button
                  type="button"
                  className="admin-page__add-btn"
                  onClick={openAddCategoryModal}
                >
                  + Add Category
                </button>
              </div>

              <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Slug</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id}>
                        <td><strong>{cat.name}</strong></td>
                        <td>{cat.slug}</td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              type="button"
                              className="admin-page__action-btn admin-page__action-btn--edit"
                              onClick={() => openEditCategoryModal(cat)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-page__action-btn admin-page__action-btn--delete"
                              onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", color: "#666" }}>
                          No categories found. Click "+ Add Category" to create one.
                        </td>
                      </tr>
                    )}
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
                      <th>Items</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td><strong>#{order._id.slice(-6).toUpperCase()}</strong></td>
                        <td>
                          <div>{order.buyer?.name || "Customer"}</div>
                          <small style={{ color: "#777" }}>{order.buyer?.email}</small>
                        </td>
                        <td>
                          {order.products?.map((p, idx) => (
                            <div key={idx} style={{ fontSize: "0.75rem" }}>
                              {p.name || p.product?.name || "Item"} x{p.quantity}
                            </div>
                          ))}
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td><strong>${order.finalTotal || order.subtotal || 0}</strong></td>
                        <td>
                          <span className={`admin-page__badge admin-page__badge--${order.status === "Delivered" ? "success" : order.status === "Processing" ? "info" : order.status === "Cancel" ? "danger" : "warning"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select
                            defaultValue={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #ccc", outline: "none" }}
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
                        <td colSpan="7" style={{ textAlign: "center", color: "#666" }}>
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

        {/* Product Modal (Add / Edit) */}
        {showProductModal && (
          <div className="admin-page__modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="admin-page__modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-page__modal-header">
                <h3 className="admin-page__modal-title">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  type="button"
                  className="admin-page__modal-close"
                  onClick={() => setShowProductModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="admin-page__form">
                <div className="admin-page__form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Graphic T-shirt"
                  />
                </div>

                <div className="admin-page__form-group">
                  <label>Description *</label>
                  <textarea
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product details, material, fit..."
                  />
                </div>

                <div className="admin-page__form-row">
                  <div className="admin-page__form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Original Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      placeholder="Optional strikethrough"
                    />
                  </div>
                </div>

                <div className="admin-page__form-row">
                  <div className="admin-page__form-group">
                    <label>Category *</label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-page__form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-page__form-row">
                  <div className="admin-page__form-group">
                    <label>Dress Style</label>
                    <select
                      value={productForm.dressStyle}
                      onChange={(e) => setProductForm({ ...productForm, dressStyle: e.target.value })}
                    >
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Party">Party</option>
                      <option value="Gym">Gym</option>
                    </select>
                  </div>

                  <div className="admin-page__form-group">
                    <label>Product Image (Max 1MB)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductForm({ ...productForm, photo: e.target.files[0] })}
                    />
                  </div>
                </div>

                <div className="admin-page__form-row">
                  <div className="admin-page__form-group">
                    <label>Available Colors (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.colors}
                      onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                      placeholder="Black, White, Blue, Olive"
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Available Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.sizes}
                      onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                      placeholder="Small, Medium, Large, X-Large"
                    />
                  </div>
                </div>

                <div className="admin-page__form-actions">
                  <button
                    type="button"
                    className="admin-page__btn-cancel"
                    onClick={() => setShowProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-page__btn-submit">
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Modal (Add / Edit) */}
        {showCategoryModal && (
          <div className="admin-page__modal-overlay" onClick={() => setShowCategoryModal(false)}>
            <div className="admin-page__modal" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
              <div className="admin-page__modal-header">
                <h3 className="admin-page__modal-title">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  type="button"
                  className="admin-page__modal-close"
                  onClick={() => setShowCategoryModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="admin-page__form">
                <div className="admin-page__form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. T-shirts, Shirts, Jeans"
                    autoFocus
                  />
                </div>

                <div className="admin-page__form-actions">
                  <button
                    type="button"
                    className="admin-page__btn-cancel"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-page__btn-submit">
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
