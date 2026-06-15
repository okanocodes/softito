import React from 'react'

const ShoppingProductCard = ({ name, price, amount }) => {
    return (
        <div className='border-b space-y-1'>
            <h4 className='font-bold'>{name}</h4>
            <p className='text-gray-600 text-sm'>Fiyat: {price} TL</p>
            <div className='flex gap-2 items-center mb-1'>
                <button className='bg-gray-200 border border-gray-300 py-2 px-4 rounded-lg'>-</button>
                <span>{amount}</span>
                <button className='bg-gray-200 border border-gray-300 py-2 px-4 rounded-lg'>+</button>
                <button className='bg-red-600 text-white border border-gray-800 py-2 px-4 rounded-lg'>Sil</button>
            </div>
        </div>
    )

}

const ShoppingCart = () => {
    return (
        <div className='border border-gray-200 shadow p-6 rounded-xl h-fit'>
            <h2 className='text-2xl font-bold'>Sepetiniz</h2>
            <div className='p-4'>
                <div className='space-y-2 mb-2'>
                    <ShoppingProductCard name="Yedek Kablosuz Klavye" price={750} amount={1} />
                    <ShoppingProductCard name="Yedek Oyuncu Faresi" price={600} amount={2} />
                </div>
                <div className='font-bold'>Toplam Tutar: <span className='text-blue-600'>1350 TL</span></div>
                <div className='flex gap-4 mt-2'>
                    <button className='bg-gray-200 border border-gray-300 py-2 px-4 rounded-lg'>Temizle</button>
                    <button className='bg-green-700 border border-gray-800 text-white py-2 px-4 rounded-lg'>Satın Al</button>

                </div>
            </div>
        </div>
    )
}

export default ShoppingCart