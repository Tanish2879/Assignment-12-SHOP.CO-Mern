import versaceLogo from "../assets/images/versace.svg";
import zaraLogo from "../assets/images/zara.svg";
import gucciLogo from "../assets/images/gucci.svg";
import pradaLogo from "../assets/images/prada.svg";
import calvinKleinLogo from "../assets/images/calvinklein.svg";

const Brands = ({
  brands = [
    { name: "Versace", logo: versaceLogo },
    { name: "Zara", logo: zaraLogo },
    { name: "Gucci", logo: gucciLogo },
    { name: "Prada", logo: pradaLogo },
    { name: "Calvin Klein", logo: calvinKleinLogo }
  ]
}) => {
  return (
    <section className="brands" id="brands" aria-label="Featured Brands">
      <div className="brands__container">
        {brands.map((brand, index) => (
          <div key={index} className="brands__item">
            <img src={brand.logo} alt={brand.name} className="brands__logo" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;