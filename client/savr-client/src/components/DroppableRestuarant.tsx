import React, { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import RestuarantLayout from './RestuarantLayout/RestuarantLayout';
import NavBar from './RestuarantLayout/Navbar/NavBar';
import Snackbar from '@mui/material/Snackbar';

const HEADER_HEIGHT = 100; // Adjust as needed

const DroppableArea = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-area',
  });
  const [touchedBoundary, setTouchedBoundary] = useState(false);
  const [chairs, setChairs] = useState<{ id: string; x: number; y: number }[]>([]);
  const [isChairPressed, setIsChairPressed] = useState(false);

  const [isTablePressed, setIsTablePressed] = useState(false);
  const [isRoundTablePressed, setIsRoundTablePressed] = useState(false);
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    console.log(event)
    setChairs((prev) =>
      prev.map((chair) => {
        if (chair.id === active.id) {
          const newX = chair.x + delta.x;
          const newY = chair.y + delta.y;
          // Prevent overlap with header
          if (newY < HEADER_HEIGHT) {
            console.log("touched boundary")
            setTouchedBoundary(true);
            return chair; // Don't move if in header area
          }
          // (Optional: add your overlap check with other chairs here)
          return { ...chair, x: newX, y: newY };
        }
        return chair;
      })
    );
  };

  const preventOverlap = (newX: number, newY: number, id: string, chairs: { id: string; x: number; y: number }[], width: number, height: number) => {
    chairs.forEach((chair) => {
      if (newX < chair.x + 100 && newX + 100 > chair.x && newY < chair.y + 100 && newY + 100 > chair.y) {
        return true;
      }
    });
    return false;
  }

  const addChair = () => {
    setChairs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100 }
    ]);
    setIsChairPressed(true);
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setNodeRef} style={style}>
        <NavBar addChair={addChair} isChairPressed={isChairPressed} setIsChairPressed={setIsChairPressed} />
      
        {chairs.map((chair) => (
          <RestuarantLayout key={chair.id} id={chair.id} position={{ x: chair.x, y: chair.y }} onDelete={deleteChair}/>
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