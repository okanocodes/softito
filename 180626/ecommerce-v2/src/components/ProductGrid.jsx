import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onProductClick, onAddToCart }) {
  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}
            onProductClick={onProductClick}
            onAddToCart={(product) => onAddToCart(product)}
          />
        ))}
      </div>
    </>
  );
}
