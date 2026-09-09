import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import logo from "../assets/images/SHOP.CO.png";

const Header = ({
  cartCount: propCartCount,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  navLinks = [
    { label: "Shop", path: "/shop", hasDropdown: true },
    { label: "On Sale", path: "/shop?filter=sale" },
    { label: "New Arrivals", path: "/shop?filter=new" },
    { label: "Brands", path: "/#brands" },
    // { label: "Admin Panel", path: "/admin" }
  ]
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();
  const { cartCount: contextCartCount } = useCart();
  const cartCount = propCartCount !== undefined ? propCartCount : contextCartCount;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = (localSearch || searchQuery).trim();
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/shop");
    }
  };

  const [auth, setAuth] = useAuth();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    setAdminMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header__container">
        {/* Mobile menu toggle button */}
        <button
          type="button"
          className={`site-header__menu-toggle ${isMobileMenuOpen ? "site-header__menu-toggle--active" : ""}`}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="site-header__hamburger-bar" />
          <span className="site-header__hamburger-bar" />
          <span className="site-header__hamburger-bar" />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="site-header__logo-link">
          <img src={logo} alt="SHOP.CO" className="site-header__logo" />
        </Link>

        {/* Navigation Links */}
        <nav
          className={`site-header__nav ${isMobileMenuOpen ? "site-header__nav--open" : ""}`}
          aria-label="Main Navigation"
        >
          <ul className="site-header__menu">
            {navLinks.map((link, index) => (
              <li key={index} className="site-header__menu-item">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `site-header__link ${isActive ? "site-header__link--active" : ""}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <svg
                      className="site-header__dropdown-icon"
                      width="12"
                      height="7"
                      viewBox="0 0 12 7"
                      fill="none"
                    >
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search Bar */}
        <form className="site-header__search" onSubmit={handleSearch}>
          <svg
            aria-hidden="true"
            className="site-header__search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="search"
            placeholder="Search for products..."
            className="site-header__search-input"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
          />
        </form>

        {/* Header Action Icons */}
        <div className="site-header__actions">
          {/* Mobile search toggle button (visual only) */}
          <button
            type="button"
            className="site-header__action-btn site-header__action-btn--mobile-search"
            aria-label="Open Search"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Cart link */}
          <Link to="/cart" className="site-header__action-btn" aria-label="View Shopping Cart">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="site-header__badge" aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Icon / Dropdown Modal */}
          <div
            className="site-header__account-wrapper"
            onMouseEnter={() => setAdminMenuOpen(true)}
            onMouseLeave={() => setAdminMenuOpen(false)}
          >
            <button
              type="button"
              className="site-header__action-btn"
              aria-label="Account Menu"
              onClick={() => setAdminMenuOpen((prev) => !prev)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={auth?.user ? "#000" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Account Dropdown Modal */}
            {adminMenuOpen && (
              <div className="site-header__account-dropdown">
                {auth?.user ? (
                  <>
                    <div className="site-header__dropdown-header">
                      <strong>{auth.user.name || "User"}</strong>
                      <span>{auth.user.role === 1 ? "Administrator" : "Customer"}</span>
                    </div>

                    <Link
                      to="/admin"
                      className="site-header__dropdown-item"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>

                    <Link
                      to="/profile"
                      className="site-header__dropdown-item"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="site-header__dropdown-item"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      My Orders
                    </Link>

                    <button
                      type="button"
                      className="site-header__dropdown-item site-header__dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="site-header__dropdown-header">
                      <strong>Welcome Guest</strong>
                      <span>Sign in to access your account</span>
                    </div>

                    <Link
                      to="/login"
                      className="site-header__dropdown-item"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      Log In
                    </Link>

                    <Link
                      to="/signup"
                      className="site-header__dropdown-item"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      Sign Up
                    </Link>

                    <Link
                      to="/admin"
                      className="site-header__dropdown-item"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;