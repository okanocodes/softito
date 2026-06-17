import { useState, useEffect } from "react";

export default function KampanyaBanner() {
  // Başlangıçta 3 saat + 20 dakika toplam saniye cinsinden ayarla
  const [secondsLeft, setSecondsLeft] = useState(3600 * 3 + 1200);

  useEffect(() => {
    // Her saniye çalışacak interval timer oluştur
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        // Sayaç sıfıra ulaştığında tekrar başlangıç değerine dön
        if (prev <= 1) {
          return 3600 * 3 + 1200;
        }
        // Aksi halde bir saniye azalt
        return prev - 1;
      });
    }, 1000);

    return () => {
      // Component unmount olduğunda interval'i temizle
      clearInterval(timer);
    };
  }, []);

  // Verilen toplam saniyeyi saat:dakika:saniye formatına çevir
  const formatCountdown = (totalSecs) => {
    // Tam saat sayısını hesapla
    const hours = Math.floor(totalSecs / 3600);
    // Kalan dakikayı hesapla
    const minutes = Math.floor((totalSecs % 3600) / 60);
    // Kalan saniyeyi hesapla
    const seconds = totalSecs % 60;
    // Saat, dakika ve saniyeyi iki basamaklı string olarak birleştir
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="slider-banner">
      <div className="slider-bilgi">
        <span className="slider-etiket">GÜNÜN FIRSATI</span>
        <h2 className="slider-baslik">Büyük Yaz İndirimleri Başladı!</h2>
        <p className="slider-detay">
          Tüm Elektronik, Giyim ve Kitaplarda sepette anında %40'a varan indirimleri kaçırmayın.
        </p>
      </div>

      <div className="slider-sayac">
        <span>⏰ Kalan Süre:</span>
        <span>{formatCountdown(secondsLeft)}</span>
      </div>
    </div>
  );
}
