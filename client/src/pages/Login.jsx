import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Client-side validation
    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com)");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
        email: trimmedEmail,
        password
      });

      if (res.data && res.data.success) {
        // Save auth data to state and localStorage
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token
        });
        localStorage.setItem("auth", JSON.stringify(res.data));

        // Redirect based on role (1 = admin, 0 = customer)
        if (res.data.user?.role === 1) {
          navigate("/admin");
        } else {
          navigate(location.state || "/");
        }
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login">
      <div className="login__content">
        <header className="login__header">
          <p className="login__eyebrow">SHOP.CO</p>
          <h1 className="login__title">Welcome back</h1>
          <p className="login__welcome">
            Sign in to continue shopping with us.
          </p>
        </header>

        {error && (
          <div style={{ color: "#ff3333", backgroundColor: "rgba(255,51,51,0.1)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.875rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label className="login__label" htmlFor="email">
              Email address
            </label>
            <input
              className="login__input"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">
              Password
            </label>
            <input
              className="login__input"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>

          <button type="submit" className="login__button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="login__switch-text">
            Don't have an account?{" "}
            <Link to="/signup" className="login__switch-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
