import React, { useState, useRef } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { data, useLocation } from 'react-router-dom';

import NavBar from './Navbar/NavBar';
import Snackbar from '@mui/material/Snackbar';
import TableLayout from './TableLayout';
import axios from 'axios';
import List from './List';
import Box from '@mui/joy/Box';
const HEADER_HEIGHT = 100; // Adjust as needed
const CHAIR_SIZE = 40;
const TABLE_WIDTH = 70;
const TABLE_HEIGHT = 70;
const CONTAINER_WIDTH = 1700;
const CONTAINER_HEIGHT = 800;

function isOverlapping(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
) {
  return (
    x1 <= x2 + w2 &&
    x1 + w1 >= x2 &&
    y1 <= y2 + h2 &&
    y1 + h1 >= y2
  );
}

const DroppableArea = () => {
  const location = useLocation();
  const restaurantCardData = location.state;
  console.log(restaurantCardData)
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-area',
  });
  const [touchedBoundary, setTouchedBoundary] = useState(false);
  const [chairs, setChairs] = useState<{ id: string; x: number; y: number, rotation: number, width: number, height: number }[]>([]);
  const [tables, setTables] = useState<{ id: string; x: number; y: number; rotation: number, height: number, width: number, shape: string, description: string, maxPartySizeRange: string, tableNumber: string }[]>([]);
  const [isChairPressed, setIsChairPressed] = useState(false);

  const [isTablePressed, setIsTablePressed] = useState(false);
  const [isRoundTablePressed, setIsRoundTablePressed] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    active: boolean;
  } | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const getContainerSize = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    return {
      width: rect?.width || 0,
      height: rect?.height || 0,
    };
  };

 
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;

    // If the dragged item is selected, move all selected items of the same type
    if (selectedIds.includes(active.id)) {
      setChairs((prev) =>
        prev.map((chair) =>
          selectedIds.includes(chair.id)
            ? { ...chair, x: chair.x + delta.x, y: chair.y + delta.y }
            : chair
        )
      );
      setTables((prev) =>
        prev.map((table) =>
          selectedIds.includes(table.id)
            ? { ...table, x: table.x + delta.x, y: table.y + delta.y }
            : table
        )
      );
      return;
    }

    // Otherwise, move just the single item as before
    const { width: containerWidth, height: containerHeight } = getContainerSize();
    setChairs((prev) =>
      prev.map((chair) => {
        if (chair.id === active.id) {
          let newX = chair.x + delta.x;
          let newY = chair.y + delta.y;
          // Restrict to bounds
          newX = Math.max(0, Math.min(newX, containerWidth - chair.width));
          newY = Math.max(0, Math.min(newY, containerHeight - chair.height));
          if (newY < HEADER_HEIGHT) {
            setTouchedBoundary(true);
            return chair;
          }
          const overlapWithChairs = chairs.some(
            (c) =>
              c.id !== chair.id &&
              isOverlapping(
                newX, newY, CHAIR_SIZE, CHAIR_SIZE,
                c.x, c.y, CHAIR_SIZE, CHAIR_SIZE
              )
          );
          const overlapWithTables = tables.some(
            (t) =>
              isOverlapping(
                newX, newY, CHAIR_SIZE, CHAIR_SIZE,
                t.x, t.y, TABLE_WIDTH, TABLE_HEIGHT
              )
          );
          if (overlapWithChairs) {
            setTouchedBoundary(true);
            return chair;
          }
          return { ...chair, x: newX, y: newY };
        }
        return chair;
      })
    );

    setTables((prev) => 
      prev.map((table) => {
        if (table.id === active.id) {
          let newX = table.x + delta.x;
          let newY = table.y + delta.y;
          // Restrict to bounds
          newX = Math.max(0, Math.min(newX, containerWidth - table.width));
          newY = Math.max(0, Math.min(newY, containerHeight - table.height));
          // if (newY >= HEADER_HEIGHT) {
          //   setTouchedBoundary(true);
          //   return table;
          // }
          const overlapWithTables = tables.some(
            (t) =>
              t.id !== table.id &&
              isOverlapping(
                newX, newY, TABLE_WIDTH, TABLE_HEIGHT,
                t.x, t.y, TABLE_WIDTH, TABLE_HEIGHT
              )
          );
          const overlapWithChairs = chairs.some(
            (c) =>
              isOverlapping(
                newX, newY, TABLE_WIDTH, TABLE_HEIGHT,
                c.x, c.y, CHAIR_SIZE, CHAIR_SIZE
              )
          );
          if (overlapWithTables || overlapWithChairs) {
            setTouchedBoundary(true);
            return table;
          }
          return { ...table, x: newX, y: newY };
        }
        return table;
      })
    );
  };

  const addChair = () => {
    setChairs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0, width: CHAIR_SIZE, height: CHAIR_SIZE }
    ]);
    setIsChairPressed(true);
  };

  const addTable = (shape:string) => {
    setTables((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0, height: TABLE_HEIGHT, width: TABLE_WIDTH, shape: shape, description: "", maxPartySizeRange: "", tableNumber: ""}
    ]);
    setIsTablePressed(true);
  };

  const updateTableSize = (id: string, width: number, height: number) => {
    setTables(prev =>
      prev.map(table =>
        table.id === id ? { ...table, width, height } : table
      )
    );
  };

  const updateTableDetails = (id: string, description: string, maxPartySizeRange: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === id ? { ...table, description, maxPartySizeRange } : table
      )
    );
  };
  const updateTableNumber = (id: string, tableNumber: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === id ? { ...table, tableNumber } : table
      )
    );
  };
  const updateChairSize = (id: string, width: number, height: number) => {
    setChairs(prev =>
      prev.map(chair =>
        chair.id === id ? { ...chair, width, height } : chair
      )
    );
  };
  const deleteChair = (id: string) => {
    setChairs((prev) => prev.filter((chair) => chair.id !== id));
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  const saveLayout = () => {

    //TODO: Add a restuarant Name to the layout when we scrape 
    const layout = {
      chairs: [...chairs],
      tables: [...tables]
    }
    console.log(layout)
    axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/save-layout',
      data: {
        layout,
        restaurantCardData
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    .then((response) => {
      console.log(data)

      console.log(response)
    })
    .catch((error) => {
      console.error('Error saving layout:', error);
    });

  }

  const rotateTable = (id: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id
          ? { ...table, rotation: (table.rotation + 90) % 360 }
          : table
      )
    );
  };

  const rotateChair = (id: string) => {
    setChairs((prev) =>
      prev.map((chair) =>
        chair.id === id
          ? { ...chair, rotation: (chair.rotation + 90) % 360 }
          : chair
      )
    );
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start if not clicking on a chair/table
    if (e.target === e.currentTarget) {
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY,
        active: true,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectionBox?.active) {
      setSelectionBox(box => box && ({
        ...box,
        endX: e.clientX,
        endY: e.clientY,
      }));
    }
  };

  const handleMouseUp = () => {
    if (selectionBox?.active) {
      // Calculate selection rectangle
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);

      // Find all chairs/tables inside the rectangle
      const selected = [
        ...chairs.filter(chair =>
          chair.x >= minX && chair.x <= maxX &&
          chair.y >= minY && chair.y <= maxY
        ).map(chair => chair.id),
        ...tables.filter(table =>
          table.x >= minX && table.x <= maxX &&
          table.y >= minY && table.y <= maxY
        ).map(table => table.id),
      ];

      setSelectedIds(selected);
      setSelectionBox(null);
    }
  };

  
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
  };

  const dragAreaStyle: React.CSSProperties = {
    width: '80vw',           // 80% of the viewport width
    height: '80vh',          // 80% of the viewport height
    minWidth: 320,           // Minimum width in px
    minHeight: 320,          // Minimum height in px
    maxWidth: 1700,          // Maximum width in px (optional)
    maxHeight: 900,          // Maximum height in px (optional)
    background: 'rgb(208, 212, 229)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1.5px solid rgba(255,255,255,0.18)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    marginTop: '0px',
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
    <DndContext onDragEnd={handleDragEnd}>
      <div style={containerStyle}>
        <NavBar 
          restaurantCardData={restaurantCardData.restaurantCardData} 
          addChair={addChair}
          isChairPressed={isChairPressed} 
          setIsChairPressed={setIsChairPressed} 
          addTable={addTable}
          isTablePressed={isTablePressed} 
          setIsTablePressed={setIsTablePressed} 
          saveLayout={saveLayout}
          style={navBarStyle}
        />
        <div
          ref={el => {
            setNodeRef(el);
            containerRef.current = el;
          }}
          style={dragAreaStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
      >
         {tables.map((table) => (
    <TableLayout
    restaurantCardData={restaurantCardData}
      viewOnly={false}
      key={table.id}
      id={table.id}
      position={{ x: table.x, y: table.y }}
      rotation={table.rotation}
      onDelete={deleteTable}
      onRotate={rotateTable}
      selected={selectedIds.includes(table.id)}
      width={table.width}
      height={table.height}
      description={table.description}
      maxPartySizeRange={table.maxPartySizeRange}
      onResize={updateTableSize} 
      shape={table.shape}
      updateTableDetails = {updateTableDetails}
      tableNumberforTable={table.tableNumber}
      updateTableNumber={updateTableNumber}
      ownerView={false}
      reservationData={() =>{}}
      restaurantInfo={() =>{}}
    
    />
  ))}

          {touchedBoundary && (
            <Snackbar
              open={touchedBoundary}
              autoHideDuration={4000}
              onClose={() => setTouchedBoundary(false)}
              message="Can't place object there!"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
          )}
         
          {selectionBox && selectionBox.active && (
            <div
              style={{
                position: 'fixed',
                left: Math.min(selectionBox.startX, selectionBox.endX),
                top: Math.min(selectionBox.startY, selectionBox.endY),
                width: Math.abs(selectionBox.endX - selectionBox.startX),
                height: Math.abs(selectionBox.endY - selectionBox.startY),
                background: 'rgba(100, 149, 237, 0.2)',
                border: '1.5px solid #3973db',
                zIndex: 1000,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default DroppableArea;