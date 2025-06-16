import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MenuDisplay.css';

const cleanHTML = (raw: string): string => {
  return raw
    .replace(/```html\n?/, '')
    .replace(/```$/, '')
    .replace(/\\n/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim();
};

interface MenuItemInfo {
  name: string;
  price: string;
  description?: string;
}

const MenuDisplay: React.FC = () => {
  const [menuHtml, setMenuHtml] = useState<any[][]>([]); // should be array of arrays
  const [selectedItem, setSelectedItem] = useState<MenuItemInfo | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-all-menu-html')
      .then((res) => {
        console.log(res.data.menu_htmls);
        setMenuHtml(res.data.menu_htmls); // keep raw array structure here
        console.log(res.data.menu_htmls[0][0].html)
      });
  }, []);

  // Define the handler outside useEffect
  const handleMenuItemClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const menuItem = target.closest('.menu-item');
    
    if (menuItem) {
      // Extract menu item information
      const nameElement = menuItem.querySelector('h3');
      const priceElement = menuItem.querySelector('.price');
      const descElement = menuItem.querySelector('p:not(.price)');
      
      const name = nameElement ? nameElement.textContent || '' : '';
      const price = priceElement ? priceElement.textContent || '' : '';
      const description = descElement ? descElement.textContent || '' : '';
      
      // Log detailed information about the clicked item
      console.log('=== MENU ITEM CLICKED ===');
      console.log('Menu Item HTML:', menuItem.outerHTML);
      console.log('Name:', name);
      console.log('Price:', price);
      console.log('Description:', description);
      console.log('========================');
      
      setSelectedItem({ name, price, description });
      
      // Prevent event bubbling
      event.stopPropagation();
    }
  };

  useEffect(() => {
    // Add click event listener to the document
    document.addEventListener('click', handleMenuItemClick as unknown as EventListener);
    
    return () => {
      document.removeEventListener('click', handleMenuItemClick as unknown as EventListener);
    };
  }, []);

  return (
    <>
      {selectedItem && (
        <div className="selected-item-modal">
          <div className="selected-item-content">
            <h2>{selectedItem.name}</h2>
            <p className="selected-item-price">{selectedItem.price}</p>
            {selectedItem.description && <p>{selectedItem.description}</p>}
            <button onClick={() => setSelectedItem(null)}>Close</button>
          </div>
        </div>
      )}
      
      <div ref={menuContainerRef} onClick={handleMenuItemClick}>
        {menuHtml.map((group, groupIdx) => (
          <div key={groupIdx} className="card">
            {group.map((item: any, itemIdx: number) => {
              const cleaned = cleanHTML(item.html);
              return (
                <div
                  className="menu-container"
                  key={itemIdx}
                  dangerouslySetInnerHTML={{ __html: cleaned }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuDisplay;
