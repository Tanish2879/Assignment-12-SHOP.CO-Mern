import { Link } from "react-router-dom";
import heroImg from "../assets/images/style/heroimage.jpg";
import bigStar from "../assets/bigstar.svg";
import smallStar from "../assets/smallstar.svg";

const Hero = ({
  title = "FIND CLOTHES THAT MATCHES YOUR STYLE",
  subtitle = "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  ctaText = "Shop Now",
  ctaLink = "/shop",
  stats = [
    { value: "200+", label: "International Brands" },
    { value: "2,000+", label: "High-Quality Products" },
    { value: "30,000+", label: "Happy Customers" }
  ]
}) => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">{title}</h1>

          <p className="hero__subtitle">{subtitle}</p>

          <Link to={ctaLink} className="hero__cta-btn">
            {ctaText}
          </Link>

          <div className="hero__statistics">
            {stats.map((stat, index) => (
              <div key={index} className="hero__stat-item">
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__media">
          <img src={heroImg} alt="Fashion Showcase" className="hero__image" />
          <img src={bigStar} alt="" className="hero__star hero__star--big" aria-hidden="true" />
          <img src={smallStar} alt="" className="hero__star hero__star--small" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
