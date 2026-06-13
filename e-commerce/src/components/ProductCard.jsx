import React from 'react'

const ProductCard = (props) => {
    return (
        <div className='border border-gray-200 shadow flex flex-col items-start gap-1 p-6 rounded-xl'>
            <h3 className='text-xl font-bold'>{props.name}</h3>
            <p className='text-gray-500'>Kategori: {props.category}</p>
            <span className='text-blue-500 font-bold'>Fiyat: {props.price} TL</span>
            {props.stock > 0 ?
                (
                    <span className='bg-green-200 text-green-900 text-sm px-2 py-2 font-bold rounded-md'>Stock: {props.stock} adet</span>
                ) : (
                    <span className="bg-red-300 text-white text-sm px-2 py-2 font-bold rounded-md">Stokta Yok</span>
                )
            }
            {props.stock > 0 && (
                <button className='bg-blue-500 text-white mt-4 px-4 py-2 font-bold rounded-md'>Sepete Ekle</button>

            )}
        </div>
    )
}

export default ProductCard