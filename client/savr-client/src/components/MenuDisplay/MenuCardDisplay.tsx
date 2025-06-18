import React from 'react'
import { ShoppingCartProvider } from './ShoppingCartContext'
import MenuDisplay from './MenuDisplay'

const MenuCardDisplay = () => {
  return (
    <ShoppingCartProvider>
      <MenuDisplay />
    </ShoppingCartProvider>
  )
}

export default MenuCardDisplay