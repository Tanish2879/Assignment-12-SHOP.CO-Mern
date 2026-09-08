import { useState } from "react";

const Newsletter = ({
  title = "STAY UP TO DATE ABOUT OUR LATEST OFFERS",
  placeholder = "Enter your email address",
  buttonText = "Subscribe to Newsletter",
  onSubscribe
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubscribe && email) {
      onSubscribe(email);
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
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter__input"
              required
              aria-label="Email Address"
            />
          </div>

          <button type="submit" className="newsletter__button">
            {buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
