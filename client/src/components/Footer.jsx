import { Link } from "react-router-dom";
import visaIcon from "../assets/images/payments/visa.svg";
import mastercardIcon from "../assets/images/payments/mastercard.svg";
import paypalIcon from "../assets/images/payments/paypal.svg";
import applepayIcon from "../assets/images/payments/appleplay.svg";
import googlepayIcon from "../assets/images/payments/googleplay.svg";
import twitterIcon from "../assets/icons/1.png";
import facebookIcon from "../assets/icons/2.png";
import instagramIcon from "../assets/icons/3.png";
import githubIcon from "../assets/icons/4.png";

const Footer = ({
  brandName = "SHOP.CO",
  description = "We have clothes that suit your style and which you're proud to wear. From women to men.",
  columns = [
    {
      title: "COMPANY",
      links: [
        { label: "About", path: "/about" },
        { label: "Features", path: "/features" },
        { label: "Works", path: "/works" },
        { label: "Career", path: "/career" }
      ]
    },
    {
      title: "HELP",
      links: [
        { label: "Customer Support", path: "/support" },
        { label: "Delivery Details", path: "/delivery" },
        { label: "Terms & Conditions", path: "/terms" },
        { label: "Privacy Policy", path: "/privacy" }
      ]
    },
    {
      title: "FAQ",
      links: [
        { label: "Account", path: "/faq/account" },
        { label: "Manage Deliveries", path: "/faq/deliveries" },
        { label: "Orders", path: "/faq/orders" },
        { label: "Payments", path: "/faq/payments" }
      ]
    },
    {
      title: "RESOURCES",
      links: [
        { label: "Free eBooks", path: "/resources/ebooks" },
        { label: "Development Tutorial", path: "/resources/tutorials" },
        { label: "How-To Blog", path: "/resources/blog" },
        { label: "Youtube Playlist", path: "/resources/youtube" }
      ]
    }
  ]
}) => {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        {/* Main Columns Grid */}
        <div className="site-footer__main">
          {/* Brand Info */}
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo">
              {brandName}
            </Link>
            <p className="site-footer__description">{description}</p>

            {/* Social Links */}
            <div className="site-footer__social">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="site-footer__social-link" aria-label="Twitter">
                <img className="site-footer__social-icon" src={twitterIcon} alt="Twitter" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="site-footer__social-link" aria-label="Facebook">
                <img className="site-footer__social-icon" src={facebookIcon} alt="Facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="site-footer__social-link" aria-label="Instagram">
                <img className="site-footer__social-icon" src={instagramIcon} alt="Instagram" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="site-footer__social-link" aria-label="GitHub">
                <img className="site-footer__social-icon" src={githubIcon} alt="GitHub" />
              </a>
            </div>
          </div>

          {/* Navigation Column Links */}
          {columns.map((column, index) => (
            <nav key={index} className="site-footer__column" aria-label={column.title}>
              <h3 className="site-footer__heading">{column.title}</h3>
              <ul className="site-footer__links">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="site-footer__item">
                    <Link to={link.path} className="site-footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom Bar: Copyright and Payment Badges */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            {brandName} © 2000-2026, All Rights Reserved
          </p>

          <div className="site-footer__payments" aria-label="Payment Methods">
            <span className="site-footer__payment-badge">
              <img src={visaIcon} alt="Visa" className="site-footer__payment" />
            </span>
            <span className="site-footer__payment-badge">
              <img src={mastercardIcon} alt="Mastercard" className="site-footer__payment" />
            </span>
            <span className="site-footer__payment-badge">
              <img src={paypalIcon} alt="PayPal" className="site-footer__payment" />
            </span>
            <span className="site-footer__payment-badge">
              <img src={applepayIcon} alt="Apple Pay" className="site-footer__payment" />
            </span>
            <span className="site-footer__payment-badge">
              <img src={googlepayIcon} alt="Google Pay" className="site-footer__payment" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;