import React from 'react'


const CategoryButton = ({ isActive = false, name }) => {
    return (
        <button className={`border ${isActive ? ' bg-blue-500 text-white' : 'bg-gray-200'} border-gray-300 rounded-md py-2 px-2`}>{name}</button>
    )

}

const SearchAndFilterProducts = ({ value, onChange, categories }) => {
    // const categories = ['Aksesuar', 'Ekran', 'Ses', 'Depolama']

    return (
        <div className='flex flex-col space-y-2'>
            <h2 className='text-2xl font-bold'>Ürün Ara ve Filtrele</h2>
            <input
                type="text" placeholder='Ürün adı ara...'
                className='border border-gray-200 rounded-md py-2 px-3'
                value={value}
                onChange={(e) => onChange(e.target.value)} />
            <div className='space-x-2'>
                <CategoryButton name="Tümü" isActive={true} />
                {
                    categories.map((category, index) => (
                        <CategoryButton key={index} name={category} />
                    ))
                }
            </div>

        </div>
    )
}

export default SearchAndFilterProducts