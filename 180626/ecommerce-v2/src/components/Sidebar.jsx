export default function Sidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  setView, //yeni prop
}
) {
  return (
    <>
      <aside className="sidebar">
        <h2 className="sidebar-title cursor-pointer" onClick={() => setView('categories')}>Kategoriler</h2>
        <div className="sidebar-list">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`sidebar-item ${selectedCategory === cat ? "sidebar-item-active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
