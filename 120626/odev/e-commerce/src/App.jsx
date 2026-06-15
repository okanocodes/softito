import { useState } from 'react'

import './App.css'
import ProductList from './components/ProductList'
import ShoppingCart from './components/ShoppingCart'
import SearchAndFilterProducts from './components/SearchAndFilterProducts'

function App() {
  const PRODUCTS = [
    {
      id: 1,
      name: "Yedek Kablosuz Klavye",
      category: "Aksesuar",
      price: 750,
      stock: 12,
    },
    {
      id: 2,
      name: "Yedek Oyuncu Faresi",
      category: "Aksesuar",
      price: 600,
      stock: 5,
    },
    {
      id: 3,
      name: "Yedek Full HD Monitör",
      category: "Ekran",
      price: 3200,
      stock: 3,
    },
    {
      id: 4,
      name: "Yedek Bluetooth Kulaklık",
      category: "Ses",
      price: 2000,
      stock: 1,
    },
    {
      id: 5,
      name: "500 GB SSD",
      category: "Depolama",
      price: 4000,
      stock: 0,
    }
  ]

  const CATEGORIES = [...new Set(PRODUCTS.map(product => product.category))]

  const [query, setQuery] = useState('');

  const filteredProducts = PRODUCTS.filter((product) => {
    const searchString = query.toLocaleLowerCase('tr')

    return product.name.toLocaleLowerCase('tr').includes(searchString)
  })

  return (
    <>
      <div className='bg-gray-300 p-6 min-h-screen'>
        <div className='w-full bg-white p-10 gap-5 rounded-2xl grid grid-cols-1 lg:grid-cols-[1fr_300px] items-baseline'>
          <div className='col-span-1 lg:col-span-full'>
            <SearchAndFilterProducts value={query} onChange={setQuery} categories={CATEGORIES} />
          </div>
          <ProductList filteredProducts={filteredProducts} />
          <ShoppingCart />

        </div>
      </div>
    </>
  )
}

export default App
