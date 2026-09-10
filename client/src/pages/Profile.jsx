import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Breadcrumbs from "../components/Breadcrumbs";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name || "");
      setEmail(auth.user.email || "");
      setPhone(auth.user.phone || "");
      setAddress(typeof auth.user.address === "string" ? auth.user.address : JSON.stringify(auth.user.address || ""));
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.put("http://localhost:8000/api/v1/auth/profile", {
        name,
        email,
        phone,
        address,
        password: password || undefined
      });

      if (res.data?.success) {
        setAuth({
          ...auth,
          user: res.data.updatedUser
        });
        const localAuth = JSON.parse(localStorage.getItem("auth") || "{}");
        localAuth.user = res.data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(localAuth));

        setMessage("Profile updated successfully!");
        setPassword("");
      } else {
        setError(res.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Account" }
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
              className="account-page__nav-link account-page__nav-link--active"
            >
              Profile Details
            </Link>
            <Link
              to="/orders"
              className="account-page__nav-link"
            >
              My Orders
            </Link>
          </nav>
        </div>

        {/* Profile Details Card */}
        <div className="account-page__card">
          <h2 className="account-page__card-title">Personal Information</h2>

          {message && (
            <div className="account-page__alert account-page__alert--success">
              {message}
            </div>
          )}

          {error && (
            <div className="account-page__alert account-page__alert--error">
              {error}
            </div>
          )}

          <form className="account-page__form" onSubmit={handleSubmit}>
            <div className="account-page__form-grid">
              <div className="account-page__field">
                <label className="account-page__label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="account-page__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="account-page__field">
                <label className="account-page__label" htmlFor="emailAddress">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  className="account-page__input"
                  value={email}
                  disabled
                  title="Email cannot be changed"
                />
              </div>

              <div className="account-page__field">
                <label className="account-page__label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="account-page__input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="account-page__field">
                <label className="account-page__label" htmlFor="password">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  className="account-page__input"
                  placeholder="New password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="account-page__field account-page__field--full">
                <label className="account-page__label" htmlFor="street">
                  Address
                </label>
                <input
                  type="text"
                  id="street"
                  className="account-page__input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="account-page__save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Profile;
