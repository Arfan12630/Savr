import React, { useEffect, useState } from "react";
import axios from "axios";
import ChairLayout from "../RestuarantLayout/ChairLayout";
import TableLayout from "../RestuarantLayout/TableLayout";
import ViewNavBar from "../RestuarantLayout/Navbar/ViewNavBar";
import { useLocation } from "react-router-dom";

// Use the same dimensions as DroppableRestuarant
const CONTAINER_WIDTH = 1700;
const CONTAINER_HEIGHT = 900;

const ViewRestaurantLayout: React.FC = () => {

  const [layout, setLayout] = useState<{
    name: any;
    chairs: any[];
    tables: any[];
  } | null>(null);
  const [autoAssignedTable, setAutoAssignedTable] = useState<any>(null);
  const location = useLocation();
  const reservationData = location.state?.reservationData;
  const restaurantInfo = location.state?.restaurantInfo;

  // First useEffect - fetch layout
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/get-layout?name=${restaurantInfo.name}&address=${restaurantInfo.address}`)
      .then((response) => {
        console.log(response.data);
        setLayout(response.data);
      })
      .catch((error) => console.error("Error fetching layout:", error));
  }, []);

  // Second useEffect - auto assign table
  useEffect(() => {
    if (layout && reservationData && restaurantInfo) {
      axios
        .get(
          `http://127.0.0.1:5000/auto-assign-tables?name=${restaurantInfo.name}&address=${restaurantInfo.address}&party_size=${reservationData.party_size}&time=${reservationData.time}&occasion=${reservationData.occasion}`
        )
        .then((response) => {
          console.log(response.data);
          setAutoAssignedTable(response.data);
        })
        .catch((error) => console.error("Error fetching layout:", error));
    }
  }, [reservationData, restaurantInfo, layout]);

  // Render loading state if layout is not yet loaded
  if (!layout) return <div>Loading...</div>;

  // Use the same container style as DroppableRestuarant
  const containerStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    background: "rgb(208, 212, 229)",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Use the same drag area style as DroppableRestuarant
  const viewAreaStyle: React.CSSProperties = {
    width: "200vw",
    height: "120vh",
    minWidth: 320,
    minHeight: 320,
    maxWidth: CONTAINER_WIDTH,
    maxHeight: CONTAINER_HEIGHT,
    background: "rgb(208, 212, 229)",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    marginTop: "0px",
  };

  const navBarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    zIndex: 100,
    background: 'rgba(210, 197, 238, 0.95)',
    boxShadow: '0 2px 8px rgba(57, 115, 219, 0.10)',
    borderBottom: '1.5px solid #bdbdfc',
    padding: '0.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <>
       <ViewNavBar
          style={navBarStyle}
          restaurantCardData={layout}
          addChair={() => {}}
          isChairPressed={false}
          setIsChairPressed={() => {}}
          addTable={() => {}}
          isTablePressed={false}
          setIsTablePressed={() => {}}
          saveLayout={() => {}}
        />
    
    <div style={containerStyle}>
      <div style={viewAreaStyle}>
     
        {layout.tables.map((table) => (
          <TableLayout
            ownerView={false}
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
            selected={
              autoAssignedTable &&
              autoAssignedTable.tables &&
              autoAssignedTable.tables.id === table.id
            }
            reservationData={reservationData}
            restaurantInfo={restaurantInfo}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default ViewRestaurantLayout;
