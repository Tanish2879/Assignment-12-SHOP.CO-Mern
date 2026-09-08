import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import TopBanner from "./components/TopBanner";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Category from "./pages/Category";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";

const App = () => {
  return (
    <>
      <TopBanner />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Category />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;