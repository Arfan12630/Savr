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
  section?: string;
  options?: string[];
  isCombo?: boolean;
  selectedOption?: string;
}

const MenuDisplay: React.FC = () => {
  const [menuHtml, setMenuHtml] = useState<any[][]>([]); // should be array of arrays
  const [selectedItem, setSelectedItem] = useState<MenuItemInfo | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-all-menu-html')
      .then((res) => {
        console.log(res.data.menu_htmls);
        setMenuHtml(res.data.menu_htmls); // keep raw array structure here
        console.log(res.data.menu_htmls[0][0].html)
      });
  }, []);

  // Reset item index when group changes
  useEffect(() => {
    setCurrentItemIndex(0);
  }, [currentGroupIndex]);

  // Handle clicking on an option in the modal
  const handleOptionClick = (option: string) => {
    if (selectedItem) {
      // Update the current item with the selected option
      setSelectedItem({
        ...selectedItem,
        selectedOption: option
      });
    }
  };

  // Handle adding item to order
  const handleAddToOrder = () => {
    const itemToAdd = selectedItem?.selectedOption 
      ? `${selectedItem.name} - ${selectedItem.selectedOption}` 
      : selectedItem?.name;
      
    console.log('Adding to order:', itemToAdd, 'Price:', selectedItem?.price);
    // Here you would implement the actual order functionality
    alert(`Added to order: ${itemToAdd} - ${selectedItem?.price}`);
  };

  // Define the handler outside useEffect
  const handleMenuItemClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const menuItem = target.closest('.menu-item');
    const menuCategory = target.closest('.menu-category');
    
    if (menuItem) {
      // Extract menu item information
      const nameElement = menuItem.querySelector('h3');
      const priceElement = menuItem.querySelector('.price');
      
      // Get all paragraph elements that are not price elements
      const allParagraphs = Array.from(menuItem.querySelectorAll('p:not(.price)'));
      
      // Find the closest section heading
      const sectionElement = menuItem.closest('.menu-category')?.querySelector('h2');
      
      const name = nameElement?.textContent?.trim() || '';
      const price = priceElement?.textContent?.trim() || '';
      const section = sectionElement?.textContent?.trim() || '';
      
      // Extract all text content from paragraphs
      let options: string[] = [];
      let description = '';
      
      allParagraphs.forEach(p => {
        const text = p.textContent?.trim() || '';
        if (text) {
          // Check if this looks like an option (short text that might be a food item)
          if (text.length < 50 && !text.includes('.')) {
            options.push(text);
          } else {
            // If it's longer, treat it as a description
            description += text + ' ';
          }
        }
      });
      
      description = description.trim();
      
      // Use section name as the name if no item name is found
      const displayName = name || section || 'Menu Item';
      
      // Check if this is a family combo
      const isCombo = displayName.toLowerCase().includes('combo') || 
                      displayName.toLowerCase().includes('family') ||
                      section.toLowerCase().includes('combo') ||
                      section.toLowerCase().includes('family');
      
      // Log detailed information about the clicked item
      console.log('=== MENU ITEM CLICKED ===');
      console.log('Menu Item HTML:', menuItem.outerHTML);
      console.log('Name:', name || '(none)');
      console.log('Section:', section);
      console.log('Price:', price);
      console.log('Options:', options);
      console.log('Description:', description);
      console.log('Display Name:', displayName);
      console.log('Is Combo:', isCombo);
      console.log('========================');
      
      setSelectedItem({ 
        name: displayName, 
        price, 
        description,
        section: name ? section : undefined, // Only include section if we're using a name
        options: options.length > 0 ? options : undefined,
        isCombo
      });
      
      // Prevent event bubbling
      event.stopPropagation();
    }
    // Handle clicking on a section header directly
    else if (menuCategory && !menuItem) {
      const sectionElement = menuCategory.querySelector('h2');
      if (sectionElement) {
        const section = sectionElement.textContent?.trim() || 'Menu Section';
        
        // Check if this is a combo section
        const isCombo = section.toLowerCase().includes('combo') || 
                        section.toLowerCase().includes('family');
        
        console.log('=== MENU SECTION CLICKED ===');
        console.log('Section:', section);
        console.log('Is Combo:', isCombo);
        console.log('========================');
        
        setSelectedItem({
          name: section,
          price: '',
          section: 'Menu Category',
          isCombo
        });
        
        event.stopPropagation();
      }
    }
  };

  const handlePrevious = () => {
    // If there are multiple items in the current group
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    } else {
      // Move to the previous group
      const prevGroupIndex = currentGroupIndex > 0 ? currentGroupIndex - 1 : menuHtml.length - 1;
      setCurrentGroupIndex(prevGroupIndex);
      // Set to the last item of the previous group
      if (menuHtml[prevGroupIndex]) {
        setCurrentItemIndex(menuHtml[prevGroupIndex].length - 1);
      }
    }
  };

  const handleNext = () => {
    // If there are more items in the current group
    if (menuHtml[currentGroupIndex] && currentItemIndex < menuHtml[currentGroupIndex].length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      // Move to the next group
      const nextGroupIndex = currentGroupIndex < menuHtml.length - 1 ? currentGroupIndex + 1 : 0;
      setCurrentGroupIndex(nextGroupIndex);
      setCurrentItemIndex(0);
    }
  };

  useEffect(() => {
    // Add click event listener to the document
    document.addEventListener('click', handleMenuItemClick as unknown as EventListener);
    
    return () => {
      document.removeEventListener('click', handleMenuItemClick as unknown as EventListener);
    };
  }, []);

  // Get current item to display
  const currentItem = menuHtml[currentGroupIndex]?.[currentItemIndex];
  
  // Calculate total number of items across all groups
  const totalItems = menuHtml.reduce((total, group) => total + group.length, 0);
  
  // Calculate current item number (across all groups)
  const currentItemNumber = menuHtml.slice(0, currentGroupIndex).reduce(
    (count, group) => count + group.length, 0
  ) + currentItemIndex + 1;

  // Determine if we should show the Add to Order button
  const showAddToOrder = selectedItem && (
    // Show for combos
    selectedItem.isCombo || 
    // Show for items with no options
    !selectedItem.options || 
    selectedItem.options.length === 0 || 
    // Show for items where an option has been selected
    selectedItem.selectedOption
  );

  return (
    <>
      {selectedItem && (
        <div className="selected-item-modal">
          <div className="selected-item-content">
            <h2>{selectedItem.name}</h2>
            {selectedItem.section && <p className="selected-item-section">{selectedItem.section}</p>}
            {selectedItem.price && <p className="selected-item-price">{selectedItem.price}</p>}
            
            {selectedItem.selectedOption && (
              <div className="selected-option">
                <p>Selected: <strong>{selectedItem.selectedOption}</strong></p>
              </div>
            )}
            
            {selectedItem.options && selectedItem.options.length > 0 && !selectedItem.isCombo && !selectedItem.selectedOption && (
              <div className="selected-item-options">
                <h3>Options</h3>
                <ul>
                  {selectedItem.options.map((option, index) => (
                    <li 
                      key={index} 
                      onClick={() => handleOptionClick(option)}
                      className="clickable-option"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedItem.isCombo && selectedItem.options && selectedItem.options.length > 0 && (
              <div className="selected-item-combo">
                <h3>Includes</h3>
                <ul>
                  {selectedItem.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedItem.description && (
              <p className="selected-item-description">{selectedItem.description}</p>
            )}
            
            <div className="modal-buttons">
              <button onClick={() => setSelectedItem(null)} className="close-btn">Close</button>
              
              {showAddToOrder && (
                <button onClick={handleAddToOrder} className="add-order-btn">
                  Add to Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="slideshow-container">
        {menuHtml.length > 0 && (
          <>
            <div className="slideshow-card" ref={menuContainerRef} onClick={handleMenuItemClick}>
              {currentItem && (
                <div
                  className="menu-container"
                  dangerouslySetInnerHTML={{ __html: cleanHTML(currentItem.html) }}
                />
              )}
            </div>
            
            <div className="slideshow-controls">
              <button className="slideshow-btn prev-btn" onClick={handlePrevious}>
                &lt; Previous
              </button>
              <span className="slideshow-indicator">
                {currentItemNumber} / {totalItems}
              </span>
              <button className="slideshow-btn next-btn" onClick={handleNext}>
                Next &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MenuDisplay;
