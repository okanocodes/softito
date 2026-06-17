export default function ProductCard({ title, price, category, rating, count, image }) {
    return (
        <>
            <div className="product-card">
                <div className="product-img-container">
                    <img src={image} alt={title} className="product-img" />
                </div>
                <div className="product-info">
                    <span className="product-category">{category}</span>
                    <h3 className="product-title">{title}</h3>
                    <div className="product-rating">
                        <span>*</span>
                        <span>{rating}</span>
                        <span className="text-gray-400">({count})</span>
                    </div>
                    <div className="product-price-container">
                        <span className="product-price">
                            {price} TL
                        </span>
                        <button className="product-btn"><span>+</span></button>
                    </div>
                </div>
            </div>
        </>
    )
}