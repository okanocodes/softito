import React from 'react'
import ProductCard from './ProductCard'

const ProductList = ({ filteredProducts }) => {
    return (
        <div className='flex flex-col space-y-2'>
            <h2 className='text-2xl font-bold'>Ürün Listesi</h2>
            <div className='flex flex-col gap-5'>
                {
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} name={product.name} category={product.category} price={product.price} stock={product.stock} />
                    ))
                }
                {/* <ProductCard name="Yedek Kablosuz Klavye" category="Aksesuar" price={750} stock={12} />
                <ProductCard name="Yedek Kablosuz Klavye" category="Aksesuar" price={750} stock={12} />
                <ProductCard name="Yedek Kablosuz Klavye" category="Aksesuar" price={750} stock={12} />
                <ProductCard name="Yedek Kablosuz Klavye" category="Aksesuar" price={750} stock={12} /> */}
            </div>
        </div>
    )
}

export default ProductList