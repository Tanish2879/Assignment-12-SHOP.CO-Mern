import { Link } from "react-router-dom";
import casualImg from "../assets/images/style/casual.svg";
import formalImg from "../assets/images/style/formal.svg";
import partyImg from "../assets/images/style/party.svg";
import gymImg from "../assets/images/style/gym.svg";

const DressStyle = ({
  title = "BROWSE BY DRESS STYLE",
  styles = [
    { name: "Casual", image: casualImg, link: "/shop?style=Casual", gridClass: "dress-style__item--wide-left" },
    { name: "Formal", image: formalImg, link: "/shop?style=Formal", gridClass: "dress-style__item--wide-right" },
    { name: "Party", image: partyImg, link: "/shop?style=Party", gridClass: "dress-style__item--wide-right" },
    { name: "Gym", image: gymImg, link: "/shop?style=Gym", gridClass: "dress-style__item--wide-left" }
  ]
}) => {
  return (
    <section className="dress-style" aria-labelledby="dress-style-heading">
      <div className="dress-style__container">
        <h2 id="dress-style-heading" className="dress-style__title">
          {title}
        </h2>

        <div className="dress-style__grid">
          {styles.map((style, index) => (
            <Link
              key={index}
              to={style.link}
              className={`dress-style__card ${style.gridClass || ""}`}
            >
              <span className="dress-style__card-name">{style.name}</span>
              <img
                src={style.image}
                alt={`${style.name} style`}
                className="dress-style__card-image"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DressStyle;
