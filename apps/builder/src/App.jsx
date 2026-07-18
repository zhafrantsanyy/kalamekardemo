import GlobalStyle from "./components/GlobalStyle";
import BouquetBuilder from "./pages/BouquetBuilder";

export default function App() {
  return (
    <div className="rk-root">
      <GlobalStyle />
      <BouquetBuilder />
    </div>
  );
}
