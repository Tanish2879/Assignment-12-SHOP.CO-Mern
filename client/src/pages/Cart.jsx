import Breadcrumbs from "../components/Breadcrumbs";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import Newsletter from "../components/Newsletter";
import product1 from "../assets/images/products/product1.png";
import product3 from "../assets/images/products/product3.png";
import product2 from "../assets/images/products/product2.png";

const sampleCartItems = [
  {
    id: "1",
    name: "Gradient Graphic T-shirt",
    image: product1,
    size: "Large",
    color: "White",
    price: 145,
    quantity: 1
  },
  {
    id: "2",
    name: "Checkered Shirt",
    image: product3,
    size: "Medium",
    color: "Red",
    price: 180,
    quantity: 1
  },
  {
    id: "3",
    name: "Skinny Fit Jeans",
    image: product2,
    size: "Large",
    color: "Blue",
    price: 240,
    quantity: 1
  }
];

const Cart = () => {
  return (
    <div className="cart-page">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Cart" }
        ]}
      />

      <h1 className="cart-page__title">YOUR CART</h1>

      <div className="cart-page__content">
        <div className="cart-page__items-container">
          {sampleCartItems.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              size={item.size}
              color={item.color}
              price={item.price}
              quantity={item.quantity}
            />
          ))}
        </div>

        <OrderSummary
          subtotal={565}
          discountPercentage={20}
          deliveryFee={15}
        />
      </div>

      <Newsletter />
    </div>
  );
};

export default Cart;
