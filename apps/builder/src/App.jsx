import { useState } from "react";
import GlobalStyle from "./components/GlobalStyle";
import BouquetBuilder from "./pages/BouquetBuilder";
import PapanBungaBuilder from "./pages/PapanBungaBuilder";
import FreeformBuilder from "./pages/FreeformBuilder";

const VALID_PRODUK = ["bouquet_krans", "papan_bunga", "kustom"];

export default function App() {
  const [produk, setProduk] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("produk");
    return VALID_PRODUK.includes(p) ? p : "bouquet_krans";
  });

  const switchProduk = (next) => {
    setProduk(next);
    const params = new URLSearchParams(window.location.search);
    if (next === "bouquet_krans") params.delete("produk");
    else params.set("produk", next);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="rk-root">
      <GlobalStyle />
      {produk === "papan_bunga" && <PapanBungaBuilder onSwitchProduk={switchProduk} />}
      {produk === "kustom" && <FreeformBuilder onSwitchProduk={switchProduk} />}
      {produk === "bouquet_krans" && <BouquetBuilder onSwitchProduk={switchProduk} />}
    </div>
  );
}
