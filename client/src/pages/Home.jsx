import Hero from "../components/Hero";
import Brands from "../components/BrandList";
import ProductSection from "../components/ProductSection";
import DressStyle from "../components/DressStyle";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

const Home = () => {
  // Empty states ready for API data insertion
  const newArrivals = [];
  const topSelling = [];
  const testimonials = [];

  return (
    <main className="home-page">
      <Hero />
      <Brands />
      <ProductSection
        title="NEW ARRIVALS"
        products={newArrivals}
        viewAllLink="/shop?category=new-arrivals"
        hasDivider={true}
      />
      <ProductSection
        title="TOP SELLING"
        products={topSelling}
        viewAllLink="/shop?category=top-selling"
        hasDivider={false}
      />
      <DressStyle />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </main>
  );
};

export default Home;