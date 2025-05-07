import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import NavBar from './Navbar/NavBar';
const ChairLayout = ({ onDelete, id, position , viewOnly=false }: { onDelete: (id: string) => void, id: string, position: { x: number; y: number }, viewOnly?: boolean }) => {
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
    borderRadius: 10,
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
      <div {...listeners} style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        {/* SeatGeek-style chair SVG */}
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <g>
            <rect x="6" y="24" width="6" height="8" rx="2" fill="#3973db"/>
            <rect x="28" y="24" width="6" height="8" rx="2" fill="#3973db"/>
            <path d="M8 22 Q20 10 32 22" stroke="#3973db" strokeWidth="4" fill="none"/>
            <rect x="12" y="18" width="16" height="10" rx="3" fill="#3973db"/>
            <path d="M10 34 Q20 38 30 34" stroke="#3973db" strokeWidth="3" fill="none"/>
          </g>
        </svg>
      </div>
      {showDelete && !viewOnly && (
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

export default ChairLayout;