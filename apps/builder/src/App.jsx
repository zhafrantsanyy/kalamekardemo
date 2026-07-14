import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyle";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import About from "./pages/About";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import BouquetBuilder from "./pages/BouquetBuilder";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <div className="rk-root">
        <GlobalStyle />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/produk" element={<ProductList />} />
          <Route path="/produk/:slug" element={<ProductDetail />} />
          <Route path="/builder" element={<BouquetBuilder />} />
          <Route path="/keranjang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
}
