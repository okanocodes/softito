import { useState, useEffect } from "react";

export default function Baslik({ env, sepetAdedi, onSepetAc, searchVal, onSearchChange }) {
  // Başlangıçta pencere genişliğini ve yüksekliğini state olarak ayarla
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Pencere yeniden boyutlandırıldığında çağrılacak fonksiyon
    const handleResize = () => {
      // Yeni pencere boyutlarını state'e kaydet
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // resize eventine dinleyici ekle
    window.addEventListener("resize", handleResize);
    return () => {
      // Component unmount olduğunda dinleyiciyi kaldır
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getEnvName = (cat) => {
    if (cat === "all") return "TÜM KATEGORİLER";
    return cat.toUpperCase();
  };

  return (
    <header className="eticaret-header">
      <div className="header-ust-alan">
        <div className="logo-alani">
          <div className="site-logo-link">HEPSİAL</div>
          <span className="site-logo-badge">STORE</span>
        </div>

        <div className="arama-alani">
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="arama-input"
          />
          <button className="arama-butonu">Ara</button>
        </div>

        <div className="kullanici-kontrolleri">
          <div className="menu-linki">Giriş Yap</div>
          <div className="menu-linki">Siparişlerim</div>

          <button onClick={onSepetAc} className="sepet-tetikleyici">
            <span>🛒 Sepetim</span>
            {sepetAdedi > 0 && (
              <span className="sepet-sayac-rozet">{sepetAdedi}</span>
            )}
          </button>
        </div>
      </div>

      <div className="kategori-seridi">
        <span className="badge badge-gray">{getEnvName(env)}</span>
        <span className="detail-meta-label">| Çözünürlük: {windowSize.width}px</span>
      </div>
    </header>
  );
}
