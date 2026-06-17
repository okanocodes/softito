import { useState, useMemo, useEffect, useCallback } from "react";
import Baslik from "./components/Baslik";
import KampanyaBanner from "./components/KampanyaBanner";
import UrunListesi from "./components/UrunListesi";
import UrunDetayi from "./components/UrunDetayi";
import SepetGezgini from "./components/SepetGezgini";

export default function App() {
  const [products, setProducts] = useState([]);
  const [sepet, setSepet] = useState([]);
  const [sepetAcik, setSepetAcik] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");


  // component yüklendiğinde urunler fetch ediliyor
  useEffect(() => {
    // urunler.json dosyasından ürün verisini al
    fetch("/urunler.json")
      .then((res) => {
        // cevap başarılı değilse hata gönder
        if (!res.ok) {
          throw new Error(`Katalog yüklenemedi. Sunucu hata kodu: ${res.status}`);
        }
        // JSON verisini parse et
        return res.json();
      })
      .then((data) => {
        // gelen veriyi ürün state'ine kaydet
        setProducts(data);
        // yükleme durumunu false yap
        setLoading(false);
      })
      .catch((err) => {
        // hata mesajını state'e yaz
        setError(err.message);
        // loading durumunu false yap
        setLoading(false);
      });
  }, []);


  // ürünleri listele, memo ile cachele, sadece dependecyler güncellenirse çalış
  const displayProducts = useMemo(() => {
    // eğer seçili kategori all ise tüm ürünleri göster
    const filtered = currentCategory === "all"
      ? products
      // değil ise döngüde ürün kategorisi seçili kategori olan ürünleri getir
      : products.filter((item) => item.kategori === currentCategory);


    return filtered.map((item) => {

      // products arrayinden herhangi bir eleman sepet arrayin de mi
      const sepetUrun = sepet.find((c) => c.id === item.id);

      // eğer öyleyse sepetteki ürün miktarını al 
      const sepetAdet = sepetUrun ? sepetUrun.adet : 0;
      return {
        ...item,
        // görüntülenen ürünlerin miktarını sepette olan ürünlerin miktarı kadar eksilt
        stok: Math.max(0, item.stok - sepetAdet)
      };
    });
  }, [products, currentCategory, sepet]);


  // selectedProductId ile displayProducts döngüsündeki itemlerin id değerini karşılaştır.
  // eğer aynı ise getir ya da null dönder
  const selectedProduct = useMemo(() => {
    return displayProducts.find((p) => p.id === selectedProductId) || null;
  }, [displayProducts, selectedProductId]);

  const handleSepeteEkle = useCallback((urun) => {
    // urun stoğu bitmişse sepete ekleme
    if (urun.stok <= 0) return;

    // sepeti güncelleme fonksiyonu
    // Sepeti önceki sepet state'ine göre güncelle
    setSepet((prevSepet) => {
      // Ürün zaten sepette mi kontrolü
      const varOlan = prevSepet.find((item) => item.id === urun.id);
      // Eğer ürün zaten sepetteyse:
      if (varOlan) {
        // yeni bir sepet arrayi dön
        return prevSepet.map((item) =>
          // döngüdeki her sepet elemanını sepete eklenenle karşılaştır
          item.id === urun.id
            // eğer eşleşiyorsa ürünü kopyala ve adet değerini 1 arttır
            ? { ...item, adet: item.adet + 1 }
            // değilse değiştirmeden döndür
            : item
        );
      }
      // Eğer ürün sepette değilse yeni bir eleman ekle
      return [...prevSepet, {
        // ürün id ile yeni bir sepet elemanı oluştur
        id: urun.id,
        // ürün adı
        ad: urun.ad,
        // ürün fiyatı
        fiyat: urun.fiyat,
        // başlangıç değeri olarak 1 adet
        adet: 1
      }];
    });
  }, []);

  // Sepet içindeki ürün adedini güncellemek için fonksiyon
  const handleAdetGuncelle = useCallback((productId, yeniAdet) => {
    // Güncellenmek istenen ürünü ana ürün arrayinde bul
    const anaUrun = products.find((p) => p.id === productId);
    // Ürün bulunamazsa fonksiyonu sonlandır
    if (!anaUrun) return;

    // Yeni adet 0 veya negatif ise ürünü sepetten çıkar
    if (yeniAdet <= 0) {
      // Sepeti filtreleyerek ilgili ürünü kaldır
      setSepet((prev) => prev.filter((item) => item.id !== productId));
      // İşlem tamamlandıktan sonra çık
      return;
    }

    // Yeni adet mevcut stoktan fazla ise uyarı ver
    if (yeniAdet > anaUrun.stok) {
      // Alert uyarısı ile kullanıcıya stok sınırını bildir
      alert(`Üzgünüz, bu üründen en fazla ${anaUrun.stok} adet ekleyebilirsiniz.`);
      // Sepeti değiştirme
      return;
    }

    // Sepeti güncelle ve ilgili ürünün adetini yeni değere ayarla
    setSepet((prev) =>
      // Her sepet öğesini kontrol et
      prev.map((item) =>
        // Eğer bu öğe güncellenen ürünse
        item.id === productId
          // kopyasını oluştur ve adetini yeni değere ata
          ? { ...item, adet: yeniAdet }
          // değilse öğeyi olduğu gibi bırak
          : item
      )
    );
  }, [products]);

  // Sepetten bir ürünü çıkarmak için fonksiyon
  const handleUrunCikar = useCallback((productId) => {
    // Önceki sepet değerini al
    setSepet((prev) =>
      // Verilen productId ile eşleşmeyen ürünleri bırak
      prev.filter((item) => item.id !== productId)
    );
  }, []);

  // Seçilen kategori değiştiğinde çalışacak fonksiyon
  const handleCategoryChange = useCallback((newCat) => {
    // currentCategory state'ini yeni kategori ile güncelle
    setCurrentCategory(newCat);
  }, []);

  return (
    <div className="app-container">
      <Baslik
        env={currentCategory}
        sepetAdedi={sepet.reduce((sum, item) => sum + item.adet, 0)}
        onSepetAc={() => setSepetAcik(true)}
        searchVal={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <KampanyaBanner />

      <UrunListesi
        products={displayProducts}
        loading={loading}
        error={error}
        activeCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onSelectProduct={(item) => setSelectedProductId(item.id)}
        onSepeteEkle={handleSepeteEkle}
        searchTerm={searchTerm}
      />

      <SepetGezgini
        sepet={sepet}
        isOpen={sepetAcik}
        onClose={() => setSepetAcik(false)}
        onAdetGuncelle={handleAdetGuncelle}
        onUrunCikar={handleUrunCikar}
      />

      {selectedProductId && (
        <UrunDetayi
          product={selectedProduct}
          onClose={() => setSelectedProductId(null)}
          onSepeteEkle={handleSepeteEkle}
        />
      )}
    </div>
  );
}
