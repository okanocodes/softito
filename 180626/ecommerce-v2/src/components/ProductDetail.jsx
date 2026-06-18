export default function ProductDetail({ product, onBack, onAddToCart }) {

    if (!product) return null

    return (
        <>
            <div className="detail-container">
                <div className="detail-img-box">
                    <img src={product.image} alt={product.title} className="detail-img" />
                </div>
                <div className="detail-info-box">
                    <span className="detail-badge">{product.category}</span>
                    <h1 className="detail-rating">
                        <span>*</span>
                        <span> {product.rating} </span>
                        <span className="text-gray-400"> {product.ratingCount} Değerlendirme </span>
                    </h1>
                    <div className="detail-price">
                        {product.price.toLocaleString('tr-TR')} TL
                    </div>
                    <p className="detail-description"> {product.description} </p>
                    <div className="detail-btn-group">
                        <button className="detail-add-btn" onClick={() => onAddToCart(product)}>Sepete Ekle</button>
                        <button className="detail-back-btn" onClick={onBack}>Geri Dön</button>
                    </div>
                </div>

            </div>

        </>
    )
}
