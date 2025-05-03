import React, { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import DraggableRectangle from './RestuarantLayout/RestuarantLayout';
import NavBar from './RestuarantLayout/Navbar/NavBar';

const DroppableArea = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-area',
  });

  const [chairs, setChairs] = useState<{ id: string; x: number; y: number }[]>([]);

  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    setChairs((prev) =>
      prev.map((chair) =>
        chair.id === active.id
          ? { ...chair, x: chair.x + delta.x, y: chair.y + delta.y }
          : chair
      )
    );
  };

  const addChair = () => {
    setChairs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 100 + prev.length * 30, y: 100 }
    ]);
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
        <NavBar addChair={addChair} />
        {chairs.map((chair) => (
          <DraggableRectangle key={chair.id} id={chair.id} position={{ x: chair.x, y: chair.y }} />
        ))}
      </div>
    </DndContext>
  );
};

export default DroppableArea;