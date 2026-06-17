import { useState } from "react";
import AddProductForm from "./components/AddProductForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import Sidebar from "./components/Sidebar";

import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./productsMock";

function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [view, setView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleAddProduct = (data) => {
    const newProduct = {
      id: Date.now(),
      title: data.title,
      price: Number(data.price),
      category: data.category,
      ratingCount: 1,
      rating: 5.0,
      image: data.image,
      description: data.description
    }

    setProducts([newProduct, ...products])

    console.log('Yeni ürün handle')
    console.log(data)
  }

  // const filteredProducts = selectedCategory === "Tümü"
  //   ? products
  //   : products.filter((product) => product.category === selectedCategory);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "Tümü" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase);

    return matchesCategory && matchesSearch;
  });

  // const addNewProduct = (e) => {
  //   e.preventDefault();

  //   console.log("form submitlendi.");
  // };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <>
      <Header
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchSubmit={handleSearchSubmit}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        setView={setView}
      />
      <Navbar
        categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setView={setView}
      />
      {view === "home" ? (
        <main className="main-layout">
          <Sidebar
            categories={MOCK_CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <div className="content-area">
            <div className="content-header">
              <h1 className="page-title">
                {selectedCategory} {searchQuery && `> "${searchQuery}" `}Ürünler
              </h1>
              <span className="text-sm">
                Toplam {filteredProducts.length} Ürün
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-red-500">
                  Aradığınız kriterlere uygun ürün bulunamadı.
                </p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </main>
      ) : (
        <AddProductForm onAddProduct={handleAddProduct} categories={MOCK_CATEGORIES} setView={setView} />
      )}

      <Footer />
    </>
  );
}

export default App;
