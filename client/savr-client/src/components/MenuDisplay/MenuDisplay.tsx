import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MenuDisplay.css';
import { useShoppingCart } from './ShoppingCartContext';
import ShoppingCart from './ShoppingCart';
import MenuItemImageUpload from './MenuItemImageUpload';




interface MenuItemInfo {
  name: string;
  price: string;
  description?: string;
  section?: string;
  options?: string[];
  isCombo?: boolean;
  selectedOption?: string;
  enhancements?: string[]; 
  selectedEnhancements?: string[]; 
  imageUrl?: string;
}

export interface MenuItem extends MenuItemInfo {
  selectedOption?: string;
  quantity?: number;
  selectedEnhancements?: string[];
  imageUrl?: string;
}

const MenuDisplay: React.FC = () => {
  const [menuHtml, setMenuHtml] = useState<any[][]>([]); 
  const [selectedItem, setSelectedItem] = useState<MenuItemInfo | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [item, setItem] = useState({any:[]})
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
  const [selectedHTMLGroup, setSelectedHTMLGroup] = useState<any>([]);
  const convertOptionParagraphsToH3 = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const menuItems = tempDiv.querySelectorAll('.menu-item');
    menuItems.forEach(menuItem => {
      if (!menuItem.querySelector('.menu-item-card-image')) {
        const img = document.createElement('img');
        img.src = "https://cdn-icons-png.flaticon.com/512/98/98017.png";
        img.className = 'menu-item-card-image';
        img.alt = "Menu item";
        menuItem.insertBefore(img, menuItem.firstChild);
      }

      const paragraphs = menuItem.querySelectorAll('p');
      
      paragraphs.forEach((p: HTMLParagraphElement) => {
        const text = p.textContent?.trim() || '';
        if (text && text.length < 50 && !text.includes('.')) {
          const h3 = document.createElement('h3');
          h3.className = 'menu-option';
          h3.textContent = text;
          p.parentNode?.replaceChild(h3, p);
        }
      });
    });
    
    return tempDiv.innerHTML;
  
  };
  
  // Then modify the cleanHTML function to include this transformation
  const cleanHTML = (raw: string): string => {
    const cleaned = raw
      .replace(/```html\n?/, '')
      .replace(/```$/, '')
      .replace(/\\n/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .trim();
    // Only return the processed HTML, do not set state here!
    return convertOptionParagraphsToH3(cleaned);
    
  };
  const { addItem } = useShoppingCart();
  const isOwner = true;
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-all-menu-html')
      .then((res) => {
        //console.log(res.data.menu_htmls);
        setMenuHtml(res.data.menu_htmls); // keep raw array structure here
        console.log(res.data.menu_htmls[0][0].html)
      });
  }, []);

  // Reset item index when group changes
  useEffect(() => {
    setCurrentItemIndex(0);
  }, [currentGroupIndex]);

  // Handle clicking on an enhancement
  const handleEnhancementClick = (enhancement: string) => {
    setSelectedEnhancements(prev => {
      if (prev.includes(enhancement)) {
        // Remove if already selected
        return prev.filter(e => e !== enhancement);
      } else {
        // Add if not selected
        return [...prev, enhancement];
      }
    });
  };

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
    if (!selectedItem) return;
    
    const itemToAdd: MenuItem = {
      ...selectedItem,
      quantity: 1,
      selectedEnhancements: selectedEnhancements.length > 0 ? selectedEnhancements : undefined
    };
    
    addItem(itemToAdd);
    console.log('Added to cart:', itemToAdd.name, 'Price:', itemToAdd.price, 'Enhancements:', selectedEnhancements);
    
    // Reset and close
    setSelectedEnhancements([]);
    setSelectedItem(null);
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
      const imageElement = menuItem.querySelector('.menu-item-card-image') as HTMLImageElement;
      
      // Get all paragraph elements that are not price elements
      const allParagraphs = Array.from(menuItem.querySelectorAll('p:not(.price)'));
      // Get all h3 elements with menu-option class (our converted options)
      const optionH3s = Array.from(menuItem.querySelectorAll('h3.menu-option'));
      
      // Find the closest section heading
      const sectionElement = menuItem.closest('.menu-category')?.querySelector('h2');
      
      const name = nameElement?.textContent?.trim() || '';
      const price = priceElement?.textContent?.trim() || '';
      const section = sectionElement?.textContent?.trim() || '';
      const imageUrl = imageElement?.src || '';
      
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
      
      // Add all h3.menu-option texts as options
      optionH3s.forEach(h3 => {
        const text = h3.textContent?.trim() || '';
        if (text) {
          options.push(text);
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
      
      // For combo items, make sure we use the full combo name
      // This ensures the modal shows the complete combo name as the header
      let finalName = displayName;
      if (isCombo && name) {
        // For combos, we want to use the full name which might include the combo items
        // If the name doesn't already include "combo" but the section does, prepend the section
        if (!name.toLowerCase().includes('combo') && section.toLowerCase().includes('combo') || section.toLowerCase().includes('family')) {
          finalName = `${section} `;
        }

        if (!name.toLowerCase().includes('combo') && section.toLowerCase().includes('combo') || section.toLowerCase().includes('family') && name.toLowerCase().includes('kids')) {
          finalName = `${section} - ${name}`;
        }
      }
      
      // Log detailed information about the clicked item
      console.log('=== MENU ITEM CLICKED ===');
      console.log('Menu Item HTML:', menuItem.outerHTML);
      setSelectedHTMLGroup(menuItem.outerHTML);
      console.log('Name:', name || '(none)');
      console.log('Section:', section);
      console.log('Price:', price);
      console.log('Options:', options);
      console.log('Description:', description);
      console.log('Display Name:', finalName);
      console.log('Is Combo:', isCombo);
      console.log('========================');
      
      // Include the image URL in the selected item
      setSelectedItem({ 
        name: finalName, 
        price, 
        description,
        section: isCombo ? undefined : (name ? section : undefined), // Don't show section for combos
        options: options.length > 0 ? options : undefined,
        isCombo,
        imageUrl // Add the image URL here
      });
      
      // Prevent event bubbling
      event.stopPropagation();
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
      setSelectedHTMLGroup([]);
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

  // Extract enhancements from the page (add-ons)
  const extractEnhancements = (): string[] => {
    if (!menuContainerRef.current) return [];
    
    const addonsSection = menuContainerRef.current.querySelector('.menu-addons');
    if (!addonsSection) return [];
    
    const enhancementElements = addonsSection.querySelectorAll('p');
    return Array.from(enhancementElements).map(p => p.textContent?.trim() || '');
  };

  // Add this function to update images in the menu
  const updateMenuItemImage = (itemName: string, imageUrl: string) => {
    if (!menuContainerRef.current) return;
   // console.log(menuContainerRef.current.outerHTML);
    const menuItems = menuContainerRef.current.querySelectorAll('.menu-item');
    
    menuItems.forEach(menuItem => {
      const nameElement = menuItem.querySelector('h3');
      if (nameElement?.textContent?.trim() === itemName) {
        const imageElement = menuItem.querySelector('.menu-item-card-image') as HTMLImageElement;
        if (imageElement) {
          imageElement.src = imageUrl;
        }
      }
    });
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (selectedItem) {
      console.log('Selected item name:', selectedItem.name);
      
      setMenuHtml(prevMenuHtml => {
        const updatedMenuHtml = prevMenuHtml.map(group =>
          group.map(item => {
            // Since everything is in [0][0], we need to target the specific menu-item
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.html;
            
            // Find ALL menu items in the HTML
            const menuItems = tempDiv.querySelectorAll('.menu-item');
            let foundAndUpdated = false;
            
            menuItems.forEach(menuItem => {
              const h3 = menuItem.querySelector('h3');
              // Exact match on the h3 text content
              if (h3?.textContent?.trim() === selectedItem.name && !foundAndUpdated) {
                console.log('FOUND AND UPDATING:', selectedItem.name);
                
                // Update the image for this specific menu item
                let img = menuItem.querySelector('.menu-item-card-image') as HTMLImageElement;
                if (!img) {
                  img = document.createElement('img');
                  img.className = 'menu-item-card-image';
                  img.alt = 'Menu item';
                  menuItem.insertBefore(img, menuItem.firstChild);
                }
                img.src = imageUrl;
                foundAndUpdated = true; // Prevent updating multiple items with same name
              }
            });
            
            if (foundAndUpdated) {
              return { ...item, html: tempDiv.innerHTML };
            }
            return item;
          })
        );

        updateMenuHtmlBackend(updatedMenuHtml);
        return updatedMenuHtml; 
      });
    }
  };
  const updateMenuHtmlBackend = (updatedMenuHtml: any) => {
    console.log(updatedMenuHtml);
   
  };
  return (
    <>
      <ShoppingCart />
      
      {selectedItem && (
        <div className="selected-item-modal">
          <div className="selected-item-content">
            <h2>{selectedItem.name}</h2>
            
            {selectedItem.section && !selectedItem.isCombo && <p className="selected-item-section">{selectedItem.section}</p>}
            {selectedItem.price && <p className="selected-item-price">{selectedItem.price}</p>}
            
            {/* Display the image if available */}
            {selectedItem.imageUrl && (
              <div className="selected-item-image">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} />
              </div>
            )}
            
            {/* Add image upload component for restaurant owners */}
            {isOwner && (
              <MenuItemImageUpload 
                itemId={selectedItem.name.replace(/\s+/g, '-').toLowerCase()} 
                itemName={selectedItem.name}
                onImageUploaded={handleImageUploaded} 
              />
            )}
            
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
                <h3>For and Includes</h3>
                <ul>
                  {selectedItem.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enhancement section */}
            {extractEnhancements().length > 0 && (
              <div className="selected-item-enhancements">
                <h3>Enhance your dish</h3>
                <ul>
                  {extractEnhancements().map((enhancement, index) => (
                    <li 
                      key={index}
                      onClick={() => handleEnhancementClick(enhancement)}
                      className={selectedEnhancements.includes(enhancement) ? 'selected' : ''}
                    >
                      {enhancement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show selected enhancements */}
            {selectedEnhancements.length > 0 && (
              <div className="selected-enhancements">
                <h4>Selected Enhancements:</h4>
                <ul>
                  {selectedEnhancements.map((enhancement, index) => (
                    <li key={index}>{enhancement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedItem.description && (
              <p className="selected-item-description">{selectedItem.description}</p>
            )}
            
            <div className="modal-buttons">
              <button onClick={() => { setSelectedItem(null); setSelectedEnhancements([]); }} className="close-btn">
                Close
              </button>
              
              {showAddToOrder && (
                <button onClick={handleAddToOrder} className="add-order-btn">
                  Add to Cart
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
                  // Add a ref 
                  ref={menuContainerRef}
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
      <div className="corner-buttons">
        <button className="bottom-left-btn"> UnReserve</button>
        <button className="bottom-right-btn"> Proceed toCheckout</button>
      </div>
    </>
  );
};

export default MenuDisplay;
