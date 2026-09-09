import { useState } from "react";

const Newsletter = ({
  title = "STAY UPTO DATE ABOUT OUR LATEST OFFERS",
  placeholder = "Enter your email address",
  buttonText = "Subscribe to Newsletter",
  onSubscribe
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      if (onSubscribe) onSubscribe(email);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div className="newsletter__container">
        <h2 id="newsletter-heading" className="newsletter__title">
          {title}
        </h2>

        <form className="newsletter__form" onSubmit={handleSubmit}>
          <div className="newsletter__input-wrapper">
            <svg
              className="newsletter__input-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter__input"
              aria-label="Email Address"
            />
          </div>

          <button type="submit" className="newsletter__button">
            {subscribed ? "Subscribed!" : buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
