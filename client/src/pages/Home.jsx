import { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import Brands from "../components/BrandList";
import ProductSection from "../components/ProductSection";
import DressStyle from "../components/DressStyle";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/v1/product/get-product");
        if (res.data?.success && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error("Error fetching home products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Split into New Arrivals and Top Selling
  const newArrivals = products.slice(0, 4);
  const topSelling = products.slice(4, 8);

  const testimonials = [
    {
      _id: "t1",
      name: "Sarah M.",
      rating: 5,
      isVerified: true,
      comment:
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
    },
    {
      _id: "t2",
      name: "Alex K.",
      rating: 5,
      isVerified: true,
      comment:
        "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."
    },
    {
      _id: "t3",
      name: "James L.",
      rating: 5,
      isVerified: true,
      comment:
        "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
    }
  ];

  return (
    <main className="home-page">
      <Hero />
      <Brands />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#666" }}>
          Loading latest products...
        </div>
      ) : (
        <>
          <ProductSection
            title="NEW ARRIVALS"
            products={newArrivals}
            viewAllLink="/shop"
            hasDivider={true}
          />
          <ProductSection
            title="TOP SELLING"
            products={topSelling}
            viewAllLink="/shop"
            hasDivider={false}
          />
        </>
      )}

      <DressStyle />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </main>
  );
};

export default Home;