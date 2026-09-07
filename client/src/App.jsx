import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";


const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>

    </>
  );
};

export default App;