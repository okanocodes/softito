import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
    return (
        <>
            <div className="product-grid">

                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.title}
                        price={product.price}
                        category={product.category}
                        rating={product.rating}
                        count={product.ratingCount}
                        image={product.image}
                    />
                ))}

            </div>
        </>
    )
}