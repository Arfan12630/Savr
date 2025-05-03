import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import NavBar from './Navbar/NavBar';
const RestuarantLayout = ({ id, position }: { id: string, position: { x: number; y: number } }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const finalTransform = {
    x: (transform?.x ?? 0) + position.x,
    y: (transform?.y ?? 0) + position.y,
    scaleX: 1,
    scaleY: 1,
  };

  const rectTablestyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 120,
    height: 60,
    background: '#f4a261',
    border: '2px solid #333',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    transform: CSS.Translate.toString(finalTransform),
  };

  return (
    <>

    <div ref={setNodeRef} style={rectTablestyle} {...listeners} {...attributes}>
      RECTANGULAR TABLE
      
    </div>
    
    </>
  );
};

export default RestuarantLayout;