import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import NavBar from './Navbar/NavBar';
const RestuarantLayout = ({ onDelete, id, position }: { onDelete: (id: string) => void, id: string, position: { x: number; y: number } }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const finalTransform = {
    x: (transform?.x ?? 0) + position.x,
    y: (transform?.y ?? 0) + position.y,
    scaleX: 1,
    scaleY: 1,
  };

  const chairStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 60,
    height: 60,
    background: 'white',

    border: '2px solid black',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    transform: CSS.Translate.toString(finalTransform),
  };

  const [showDelete, setShowDelete] = React.useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDelete(true);
  };

  return (
    <>

    <div
      ref={setNodeRef}
      style={chairStyle}
      {...attributes}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onContextMenu={handleContextMenu}
    >
      <div {...listeners} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        CHAIR
      </div>
      {showDelete && (
        <button
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            zIndex: 10,
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 24,
            height: 24,
            cursor: 'pointer',
          }}
          onClick={e => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          ×
        </button>
      )}
    </div>
    
    </>
  );
};

export default RestuarantLayout;