import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your address");
      return;
    }

    if (!answer.trim()) {
      setError("Please provide an answer to the security question");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/register", {
        name: name.trim(),
        email: trimmedEmail,
        password,
        phone: phone.trim(),
        address: address.trim(),
        answer: answer.trim()
      });

      if (res.data && res.data.success) {
        navigate("/login");
      } else {
        setError(res.data.message || res.data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login">
      <div className="login__content">
        <header className="login__header">
          <p className="login__eyebrow">SHOP.CO</p>
          <h1 className="login__title">Create an account</h1>
          <p className="login__welcome">
            Sign up to start shopping and track your orders.
          </p>
        </header>

        {error && (
          <div className="login__alert-error">
            {error}
          </div>
        )}

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label className="login__label" htmlFor="name">
              Full Name
            </label>
            <input
              className="login__input"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="login__input"
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="address">
              Address
            </label>
            <input
              className="login__input"
              id="address"
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="answer">
              Security Question: What is your favorite sport?
            </label>
            <input
              className="login__input"
              id="answer"
              type="text"
              name="answer"
              placeholder="Enter answer (used for password reset)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <button type="submit" className="login__button" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="login__switch-text">
            Already have an account?{" "}
            <Link to="/login" className="login__switch-link">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Signup;
