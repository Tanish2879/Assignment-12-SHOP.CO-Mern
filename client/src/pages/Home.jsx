import ProductCard from "../components/ProductCard";

function Home() {
  const products = [
    {
      id: 1,
      name: "T-SHIRT WITH TAPE DETAILS",
      price: 120,
      originalPrice: 150,
      discount: "-20%",
      image: "/assets/images/products/product-1.png",
      rating: 4.5,
    },
    {
      id: 2,
      name: "SKINNY FIT JEANS",
      price: 240,
      originalPrice: 260,
      discount: "-8%",
      image: "/assets/images/products/product-2.png",
      rating: 4.5,
    },
    {
      id: 3,
      name: "CHECKERED SHIRT",
      price: 180,
      originalPrice: 200,
      discount: "-10%",
      image: "/assets/images/products/product-3.png",
      rating: 4.5,
    },
    {
      id: 4,
      name: "SLEEVE STRIPED T-SHIRT",
      price: 130,
      originalPrice: 160,
      discount: "-19%",
      image: "/assets/images/products/product-4.png",
      rating: 4.5,
    },
  ];

  return (
    <main>
      <section className="new-arrivals">
        <h2>NEW ARRIVALS</h2>

        <div className="product-grid">
          {/* {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))} */}
        </div>
      </section>
    </main>
  );
}

export default Home;