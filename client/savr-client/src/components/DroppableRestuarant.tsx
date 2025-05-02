import React, { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import DraggableRectangle from './RestuarantLayout/RestuarantLayout';

const DroppableArea = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-area',
  });

  // 1. Track position in state
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 2. Handle drag end
  const handleDragEnd = (event: any) => {
    const { delta } = event;
    setPosition((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  };

  const style: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    background: isOver ? '#e0ffe0' : '#f0f0f0',
    position: 'relative',
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setNodeRef} style={style}>
        <DraggableRectangle position={position} />
      </div>
    </DndContext>
  );
};

export default DroppableArea;