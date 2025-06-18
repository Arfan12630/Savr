import React, { createContext, useState, useContext } from 'react'
import { MenuItem } from './MenuDisplay'

interface ShoppingCartContextType {
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (item: MenuItem) => void;
  updateQuantity:(item: MenuItem, quantity:number) => void;
  clearItems: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Create context with default values
const ShoppingCartContext = createContext<ShoppingCartContextType>({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearItems: () => {},
    getTotalItems: () => 0,
    getTotalPrice: () => 0
});

// Custom hook to use the shopping cart context
export const useShoppingCart = () => useContext(ShoppingCartContext);

export const ShoppingCartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>([])
  
  const addItem = (item: MenuItem) => {
    // Check if item already exists in cart
    const existingItem = items.find(i => 
      i.name === item.name && i.selectedOption === item.selectedOption
    );
    
    if (existingItem) {
      // If item exists, update quantity
      updateQuantity(existingItem, (existingItem.quantity || 1) + 1);
    } else {
      // Otherwise add new item with quantity 1
      setItems([...items, { ...item, quantity: 1 }]);
    }
  };
  
  const removeItem = (item: MenuItem) => {
    setItems(items.filter(i => 
      !(i.name === item.name && i.selectedOption === item.selectedOption)
    ));
  };
  
  const updateQuantity = (item: MenuItem, quantity: number) => {
    if (quantity <= 0) {
      removeItem(item);
      return;
    }
    
    setItems(items.map(i => 
      (i.name === item.name && i.selectedOption === item.selectedOption)
        ? { ...i, quantity }
        : i
    ));
  };
  
  const clearItems = () => {
    setItems([]);
  };
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };
  
  return (
    <ShoppingCartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearItems,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </ShoppingCartContext.Provider>
  )
}

export default ShoppingCartContext