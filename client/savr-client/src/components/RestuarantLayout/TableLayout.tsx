import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import table from '../../assets/Dining_Table_Image_Horizontal-removebg-preview.png';
import ReservationModal from '../RestuarantViewLayout/ReservationModal';
import DoubleClickedText from './DoubleClickedText';
import Box from '@mui/joy/Box';
const TableLayout = ({
  restaurantCardData,
  onDelete,
  id,
  position,
  viewOnly = false,
  rotation = 0,
  onRotate,
  selected = false,
  width,
  height,
  onResize,
  shape,
}: {
  restaurantCardData: any,
  onDelete: (id: string) => void,
  id: string,
  position: { x: number; y: number },
  viewOnly?: boolean,
  rotation?: number,
  onRotate?: (id: string) => void,
  selected?: boolean,
  width: number,
  height: number,
  onResize: (id: string, width: number, height: number) => void,
  shape: string,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [size, setSize] = React.useState({ width, height });

  const [showDelete, setShowDelete] = React.useState(false);
  const [resizeOnly, setResizeOnly] = React.useState(false);

  // --- Resizing state ---
  const [resizing, setResizing] = React.useState(false);
  const [startPos, setStartPos] = React.useState<{ x: number; y: number } | null>(null);
  const [startSize, setStartSize] = React.useState<{ width: number; height: number } | null>(null);


  // -- Reserving State ---
  const [reserved, setReserved] = React.useState(false);

  // --- Reservation Modal State ---
  const [modalOpen, setModalOpen] = React.useState(false);

  // --- Double Clicked Text State ---
  const [showText, setShowText] = React.useState(false);
  const [doubleClicked, setDoubleClicked] = React.useState(false);


  // --- Mouse down on resize handle ---
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: size.width, height: size.height });
  };

  // --- Mouse move/up listeners for resizing ---
  React.useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (startPos && startSize) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        const newWidth = Math.max(60, startSize.width + dx);
        const newHeight = Math.max(30, startSize.height + dy);
        
        setSize({ width: newWidth, height: newHeight });
        onResize?.(id, newWidth, newHeight); // 🔥 Notify parent
        
      }
    };
    const handleMouseUp = () => setResizing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, startPos, startSize]);


  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizeOnly(true);
    setShowDelete(false);
  };

  const handleMouseLeave = () => {
    setResizeOnly(false);
    setShowDelete(false);
  };

  const [hovered, setHovered] = React.useState(false);

  const finalTransform = {
    x: (transform?.x ?? 0) + position.x,
    y: (transform?.y ?? 0) + position.y,
    scaleX: 1,
    scaleY: 1,
  };

  const isActuallyDragging = !!(transform && (transform.x !== 0 || transform.y !== 0));

  const tableStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: size.width,
    height: size.height,
    borderRadius: 0,
    border: selected ? '2px solid #ff9800' : '2.5px solid #274b8f',
    boxShadow: selected ? '0 0 8px #ff9800' : '0 4px 16px rgba(57, 115, 219, 0.10)',
    background: reserved ? '#ff9800' : 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    transform: CSS.Translate.toString(finalTransform) + ` rotate(${rotation}deg)`,
    transition: isActuallyDragging
      ? 'transform 0.15s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, border 0.2s, background 0.2s'
      : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, border 0.2s, background 0.2s',
  };
  if (shape == 'circle') {
    tableStyle.borderRadius = '50%';
  }
  const handleDoubleClickDelete = () => {
    setShowText(true);
  }

  return (
    <div
      ref={setNodeRef}
      style={tableStyle}
      {...attributes}

      onMouseEnter={() => {
        setHovered(true);
        if (!resizeOnly) setShowDelete(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setResizeOnly(false);
        setShowDelete(false);
      }}
      onContextMenu={handleContextMenu}
      onDoubleClick ={ () => {
        setShowText(true)
        setDoubleClicked(true)
      }}
    >
      <Box
      sx={{
 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        borderRadius: 0,
        

      }}
      > 
      {doubleClicked && showText && (
        <DoubleClickedText handleDoubleClickDelete={()=>{
          setShowText(false)
          setDoubleClicked(false)
        }} />
      )}
      </Box>
 
      <div {...listeners} style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {viewOnly && (
          <>
            <div
              onClick={e => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              style={{
                color: reserved ? '#fff' : '#333',
                background: reserved ? '#ff9800' : 'transparent',
                borderRadius: 8,
                padding: '4px 12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {reserved ? 'Reserved' : 'Reserve'}
            </div>
            <ReservationModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onReserve={() => {
                setReserved(true);
                setModalOpen(false);
              }}
              onCancel={() => {
                setReserved(false);
                setModalOpen(false);
              }}
              reserved={reserved}
            />
          </>
        )}
      </div>
      
      {/* Only show delete/rotate if not in resize-only mode */}
      {showDelete && !viewOnly && !resizeOnly && (
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

      {/* --- Resize handle --- */}
      {!viewOnly && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            background: 'black',
            borderRadius: 4,
            cursor: 'nwse-resize',
            zIndex: 20,
          }}
          onMouseDown={handleResizeMouseDown}
          title="Resize"
        />
      )}
    </div>
  );
};

export default TableLayout;