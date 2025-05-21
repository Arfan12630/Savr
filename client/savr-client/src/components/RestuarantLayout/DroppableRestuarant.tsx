import React, { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import ChairLayout from './ChairLayout';
import NavBar from './Navbar/NavBar';
import Snackbar from '@mui/material/Snackbar';
import TableLayout from './TableLayout';
import axios from 'axios';

const HEADER_HEIGHT = 100; // Adjust as needed
const CHAIR_SIZE = 50;
const TABLE_WIDTH = 220;
const TABLE_HEIGHT = 60;

function isOverlapping(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}

const DroppableArea = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-area',
  });
  const [touchedBoundary, setTouchedBoundary] = useState(false);
  const [chairs, setChairs] = useState<{ id: string; x: number; y: number }[]>([]);
  const [tables, setTables] = useState<{ id: string; x: number; y: number; rotation: number }[]>([]);
  const [isChairPressed, setIsChairPressed] = useState(false);

  const [isTablePressed, setIsTablePressed] = useState(false);
  const [isRoundTablePressed, setIsRoundTablePressed] = useState(false);
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;

    // Chair logic
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
          if (overlapWithChairs || overlapWithTables) {
            setTouchedBoundary(true);
            return chair;
          }
          return { ...chair, x: newX, y: newY };
        }
        return chair;
      })
    );

    // Table logic
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === active.id) {
          const newX = table.x + delta.x;
          const newY = table.y + delta.y;
          if (newY < HEADER_HEIGHT) {
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
  };

  const addChair = () => {
    setChairs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100 }
    ]);
    setIsChairPressed(true);
  };

  const addTable = () => {
    setTables((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100, rotation: 0 }
    ]);
    setIsTablePressed(true);
  };
  const deleteChair = (id: string) => {
    setChairs((prev) => prev.filter((chair) => chair.id !== id));
  };
  const style: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    background: isOver ? '#e0ffe0' : '#f0f0f0',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
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
      data: layout,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setNodeRef} style={style}>
        <NavBar addChair={addChair} isChairPressed={isChairPressed} setIsChairPressed={setIsChairPressed} addTable={addTable} isTablePressed={isTablePressed} setIsTablePressed={setIsTablePressed} saveLayout={saveLayout}/>
      
        {chairs.map((chair) => (
          <ChairLayout viewOnly={false}key={chair.id} id={chair.id} position={{ x: chair.x, y: chair.y }} onDelete={deleteChair}/>
        ))}
       {tables.map((table) => (
        <TableLayout
          viewOnly={false}
          key={table.id}
          id={table.id}
          position={{ x: table.x, y: table.y }}
          rotation={table.rotation}
          onDelete={deleteTable}
          onRotate={rotateTable}
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
       
      </div>
    </DndContext>
  );
};

export default DroppableArea;