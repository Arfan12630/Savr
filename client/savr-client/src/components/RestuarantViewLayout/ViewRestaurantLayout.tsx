import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChairLayout from '../RestuarantLayout/ChairLayout';
import TableLayout from '../RestuarantLayout/TableLayout';
import NavBar from '../RestuarantLayout/Navbar/NavBar';
const ViewRestaurantLayout: React.FC = () => {
  const [layout, setLayout] = useState<{ name: any, chairs: any[]; tables: any[] } | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-layout')
    
      .then(
        response => {
          console.log(response.data)
          setLayout(response.data)
        }
      )
      
      .catch(error => console.error('Error fetching layout:', error));
  }, []);

  if (!layout) return <div>Loading...</div>;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      {/* {layout.chairs.map(chair => (
        <ChairLayout viewOnly={true} key={chair.id} id={chair.id} position={{ x: chair.x, y: chair.y }} onDelete={() => {}} width={chair.width} height={chair.height} onResize={() => {}} rotation={chair.rotation} onRotate={() => {}}/>
      ))} */}
      {layout.tables.map(table => (
        <TableLayout restaurantCardData={layout} viewOnly={true} key={table.id} id={table.id} position={{ x: table.x, y: table.y }} onDelete={() => {}} width={table.width} height={table.height} onResize={()=>{}} shape={table.shape}/>
      ))}
      <NavBar restaurantCardData={layout} addChair={() => {}} isChairPressed={false} setIsChairPressed={() => {}} addTable={() => {}} isTablePressed={false} setIsTablePressed={() => {}} saveLayout={() => {}} style={{}}/>
    </div>
  );
};

export default ViewRestaurantLayout;