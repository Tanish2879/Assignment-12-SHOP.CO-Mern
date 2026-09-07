import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__main">
          {/* Brand Info */}
          <div className="site-footer__brand">
            <a href="/" className="site-footer__logo">
              SHOP.CO
            </a>
            <p className="site-footer__description">
              We have clothes that suit your style and which you're proud to wear. From women to men.
            </p>

            {/* Social Links */}
            <div className="site-footer__social">
              <a href="#" className="site-footer__social-link" aria-label="Twitter">
                <img className="site-footer__social-icon" src="assets/icons/1.png" alt="Twitter" />
              </a>
              <a href="#" className="site-footer__social-link" aria-label="Facebook">
                <img className="site-footer__social-icon" src="assets/icons/2.png" alt="Facebook" />
              </a>
              <a href="#" className="site-footer__social-link" aria-label="Instagram">
                <img className="site-footer__social-icon" src="assets/icons/3.png" alt="Instagram" />
              </a>
              <a href="#" className="site-footer__social-link" aria-label="GitHub">
                <img className="site-footer__social-icon" src="assets/icons/4.png" alt="GitHub" />
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          <nav className="site-footer__column">
            <h2 className="site-footer__heading">COMPANY</h2>
            <ul className="site-footer__links">
              <li className="site-footer__item"><a href="#" className="site-footer__link">About</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Features</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Works</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Career</a></li>
            </ul>
          </nav>

          <nav className="site-footer__column">
            <h2 className="site-footer__heading">HELP</h2>
            <ul className="site-footer__links">
              <li className="site-footer__item"><a href="#" className="site-footer__link">Customer Support</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Delivery Details</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Terms & Conditions</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Privacy Policy</a></li>
            </ul>
          </nav>

          <nav className="site-footer__column">
            <h2 className="site-footer__heading">FAQ</h2>
            <ul className="site-footer__links">
              <li className="site-footer__item"><a href="#" className="site-footer__link">Account</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Manage Deliveries</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Orders</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Payments</a></li>
            </ul>
          </nav>

          <nav className="site-footer__column">
            <h2 className="site-footer__heading">RESOURCES</h2>
            <ul className="site-footer__links">
              <li className="site-footer__item"><a href="#" className="site-footer__link">Free eBooks</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Development Tutorial</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">How-To Blog</a></li>
              <li className="site-footer__item"><a href="#" className="site-footer__link">Youtube Playlist</a></li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            Shop.co © 2000-2026, All Rights Reserved
          </p>
          <div className="site-footer__payments">
            <img src="assets/images/payments/visa.png" alt="Visa" className="site-footer__payment" />
            <img src="assets/images/payments/mastercard.png" alt="Mastercard" className="site-footer__payment" />
            <img src="assets/images/payments/paypal.png" alt="PayPal" className="site-footer__payment" />
            <img src="assets/images/payments/applepay.png" alt="Apple Pay" className="site-footer__payment" />
            <img src="assets/images/payments/googlepay.png" alt="Google Pay" className="site-footer__payment" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;