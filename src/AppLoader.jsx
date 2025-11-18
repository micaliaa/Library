import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AppLoader = () => {
  const location = useLocation();

  useEffect(() => {
    const loader = document.getElementById("initial-loader");
    if (!loader) return;

    // Tampilkan loader
    loader.style.display = "flex";
    loader.style.opacity = "1";

    // Sembunyikan loader setelah 3 detik
    const timer = setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 600); // fade out sesuai CSS
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname]); // trigger setiap pindah route

  return null; // tidak render apa-apa
};

export default AppLoader;
