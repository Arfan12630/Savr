import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChairLayout from '../RestuarantLayout/ChairLayout';
import TableLayout from '../RestuarantLayout/TableLayout';
import NavBar from '../RestuarantLayout/Navbar/NavBar';

const CONTAINER_WIDTH = 1900;
const CONTAINER_HEIGHT = 900;

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

const viewAreaStyle: React.CSSProperties = {
  width: CONTAINER_WIDTH,
  height: CONTAINER_HEIGHT,
  background: 'rgba(255,255,255,0.85)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1.5px solid rgba(255,255,255,0.18)',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
};

const ViewRestaurantLayout: React.FC = () => {
  const [layout, setLayout] = useState<{ name: any, chairs: any[]; tables: any[] } | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-layout')
      .then(response => {
        setLayout(response.data)
      })
      .catch(error => console.error('Error fetching layout:', error));
  }, []);

  if (!layout) return <div>Loading...</div>;

  return (
    <div style={containerStyle}>
      {/* <NavBar
        restaurantCardData={layout}
        addChair={() => {}}
        isChairPressed={false}
        setIsChairPressed={() => {}}
        addTable={() => {}}
        isTablePressed={false}
        setIsTablePressed={() => {}}
        saveLayout={() => {}}
        style={{ marginBottom: 24 }}
      /> */}
      <div style={viewAreaStyle}>
 
        {layout.tables.map(table => (
          <TableLayout
            restaurantCardData={layout}
            viewOnly={true}
            key={table.id}
            id={table.id}
            position={{ x: table.x, y: table.y }}
            onDelete={() => {}}
            width={table.width}
            height={table.height}
            onResize={() => {}}
            shape={table.shape}
            description={table.description}
            maxPartySizeRange={table.maxPartySizeRange}
            updateTableDetails={() => {}}
            tableNumberforTable={table.tableNumber}
            updateTableNumber={() => {}}
           
          />
        ))}
      </div>
    </div>
  );
};

export default ViewRestaurantLayout;