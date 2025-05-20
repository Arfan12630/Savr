import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import table from '../../assets/Dining_Table_Image_Horizontal-removebg-preview.png';

const TableLayout = ({
  onDelete,
  id,
  position,
  viewOnly = false,
  rotation = 0,
  onRotate
}: {
  onDelete: (id: string) => void,
  id: string,
  position: { x: number; y: number },
  viewOnly?: boolean,
  rotation?: number,
  onRotate?: (id: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [size, setSize] = React.useState({ width: 220, height: 60 });

  const tableStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: size.width,
    height: size.height,
    background: '#3973db',
    border: '2.5px solid #274b8f',
    borderRadius: 18,
    boxShadow: '0 4px 16px rgba(57, 115, 219, 0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    transform: `${CSS.Translate.toString({
      x: (transform?.x ?? 0) + position.x,
      y: (transform?.y ?? 0) + position.y,
      scaleX: 1,
      scaleY: 1,
    })} rotate(${rotation}deg)`,
    transition: 'box-shadow 0.2s, border 0.2s',
  };

  const [showDelete, setShowDelete] = React.useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDelete(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={tableStyle}
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
      }}>
        {/* Table content can go here */}
      </div>
      
      {showDelete && !viewOnly && (
        <>
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
          {onRotate && (
            <button
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                zIndex: 10,
                background: '#3973db',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                onRotate(id);
              }}
              title="Rotate"
            >
              ⟳
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TableLayout;