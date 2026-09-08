import { useState } from "react";
import { Link } from "react-router-dom";

const TopBanner = ({
  text = "Sign up and get 20% off to your first order.",
  linkText = "Sign Up Now",
  linkUrl = "/signup",
  showClose = true,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className="top-banner" role="region" aria-label="Announcement">
      <div className="top-banner__container">
        <p className="top-banner__text">
          {text}{" "}
          {linkText && linkUrl && (
            <Link to={linkUrl} className="top-banner__link">
              {linkText}
            </Link>
          )}
        </p>

        {showClose && (
          <button
            type="button"
            className="top-banner__close"
            aria-label="Close banner"
            onClick={handleClose}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBanner;