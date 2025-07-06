import React, { useState, useRef } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { data, useLocation } from 'react-router-dom';
import ChairLayout from './ChairLayout';
import NavBar from './Navbar/NavBar';
import Snackbar from '@mui/material/Snackbar';
import TableLayout from './TableLayout';
import axios from 'axios';
import './Resize.css'
import WashroomLayout from './WashroomLayout';
import KitchenLayout from './KitchenLayout';

const HEADER_HEIGHT = 60; // Adjust as needed
const CHAIR_SIZE = 40;
const TABLE_WIDTH = 40;
const TABLE_HEIGHT = 40;

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

const RestuarantLayoutPlan = () => {
  const location = useLocation();
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-area',
  });
  const [touchedBoundary, setTouchedBoundary] = useState(false);
  const [chairs, setChairs] = useState<{ id: string; x: number; y: number, rotation: number, width: number, height: number }[]>([]);
  const [tables, setTables] = useState<{ id: string; x: number; y: number; rotation: number, height: number, width: number, shape: string }[]>([]);
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
  const [dragDelta, setDragDelta] = useState<{ x: number; y: number } | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [washrooms, setWashrooms] = useState<{ id: string; x: number; y: number; rotation: number; width: number; height: number; shape: string }[]>([]);
  const [kitchens, setKitchens] = useState<{ id: string; x: number; y: number; rotation: number; width: number; height: number; shape: string }[]>([]);
  const [doors, setDoors] = useState<{ id: string; x: number; y: number; rotation: number; width: number; height: number; shape: string }[]>([]);
  const degtoRad = (deg: number) => {
    return (deg/180)*Math.PI;
  }
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;

    // If the dragged item is selected, move all selected items of the same type
    if (selectedIds.includes(active.id)) {
    
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
    setChairs((prev) =>
      prev.map((chair) => {
        if (chair.id === active.id) {
          const newX = chair.x + delta.x;
          const newY = chair.y + delta.y;
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
          const newX = table.x + delta.x;
          const newY = table.y + delta.y;
          if (newY == HEADER_HEIGHT) {
            setTouchedBoundary(true);
            return table;
          }
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

    // Washrooms
    setWashrooms((prev) =>
      prev.map((washroom) =>
        washroom.id === active.id
          ? { ...washroom, x: washroom.x + delta.x, y: washroom.y + delta.y }
          : washroom
      )
    );

    // Kitchens
    setKitchens((prev) =>
      prev.map((kitchen) =>
        kitchen.id === active.id
          ? { ...kitchen, x: kitchen.x + delta.x, y: kitchen.y + delta.y }
          : kitchen
      )
    );

    // Doors
    setDoors((prev) =>
      prev.map((door) =>
        door.id === active.id
          ? { ...door, x: door.x + delta.x, y: door.y + delta.y }
          : door
      )
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
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0, height: TABLE_HEIGHT, width: TABLE_WIDTH, shape: shape}
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
  const style: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    background: '#e9f1fa', // light blue/gray
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    borderRadius: 16,
    border: '1.5px solid #d0e2f2',
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  const saveLayout = () => {

  
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

  const addWashroom = () => {
    setWashrooms(prev => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0, width: 40, height: 40, shape: 'rectangle' }
    ]);
  };

  const addKitchen = () => {
    setKitchens(prev => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0, width: 40, height: 40, shape: 'rectangle' }
    ]);
  };

  const addDoor = () => {
    setDoors(prev => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0, width: 40, height: 40, shape: 'rectangle' }
    ]);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
          {/* <NavBar 
          restaurantCardData={() => {}} 
          addChair={addChair}
          isChairPressed={isChairPressed} 
          setIsChairPressed={setIsChairPressed} 
          addTable={addTable}
          isTablePressed={isTablePressed} 
          setIsTablePressed={setIsTablePressed} 
          saveLayout={saveLayout}
          style={navBarStyle}
         
         
        /> */}
        
        
      <div
        ref={setNodeRef}
        style={style}
        className="droppable-area"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
    
      
       {tables.map((table) => (
  <TableLayout
  restaurantCardData={() => {}}
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
    onResize={() => {}}
    shape={table.shape}
  />
))}

        {washrooms.map((washroom) => (
          <WashroomLayout
            key={washroom.id}
            id={washroom.id}
            position={{ x: washroom.x, y: washroom.y }}
            rotation={washroom.rotation}
            onDelete={id => setWashrooms(prev => prev.filter(w => w.id !== id))}
            onRotate={id => setWashrooms(prev => prev.map(w => w.id === id ? { ...w, rotation: (w.rotation + 90) % 360 } : w))}
            selected={selectedIds.includes(washroom.id)}
            width={washroom.width}
            height={washroom.height}
            onResize={(id, width, height) => setWashrooms(prev => prev.map(w => w.id === id ? { ...w, width, height } : w))}
            shape={washroom.shape}
            viewOnly={false}
          />
        ))}

        {kitchens.map((kitchen) => (
          <KitchenLayout
            key={kitchen.id}
            id={kitchen.id}
            position={{ x: kitchen.x, y: kitchen.y }}
            rotation={kitchen.rotation}
            onDelete={id => setKitchens(prev => prev.filter(k => k.id !== id))}
            onRotate={id => setKitchens(prev => prev.map(k => k.id === id ? { ...k, rotation: (k.rotation + 90) % 360 } : k))}
            selected={selectedIds.includes(kitchen.id)}
            width={kitchen.width}
            height={kitchen.height}
            onResize={(id, width, height) => setKitchens(prev => prev.map(k => k.id === id ? { ...k, width, height } : k))}
            shape={kitchen.shape}
            viewOnly={false}
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
  
   
      
    </DndContext>
  );
};

export default RestuarantLayoutPlan;