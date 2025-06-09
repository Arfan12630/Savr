import React, { useEffect, useState } from 'react';
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

const MenuDisplay: React.FC = () => {
  const [menuHtml, setMenuHtml] = useState<any[][]>([]); // should be array of arrays

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-all-menu-html')
      .then((res) => {
        console.log(res.data.menu_htmls);
        setMenuHtml(res.data.menu_htmls); // keep raw array structure here
        console.log(res.data.menu_htmls[0][0].html)
      });
  }, []);

  return (
    <>
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
    </>
  );
};

export default MenuDisplay;
