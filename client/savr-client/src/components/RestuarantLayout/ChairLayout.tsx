import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import NavBar from './Navbar/NavBar';

const ChairLayout = ({
  onDelete,
  id,
  position,
  rotation,
  viewOnly = false,
  selected = false,
  width,
  height,
  onRotate,
  onResize,
}: {
  onDelete: (id: string) => void,
  id: string,
  position: { x: number; y: number },
  rotation: number,
  viewOnly?: boolean,
  selected?: boolean,
  width: number,  
  height: number,
  onRotate: (id: string) => void,
  onResize: (id: string, width: number, height: number) => void,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const finalTransform = {
    x: (transform?.x ?? 0) + position.x,
    y: (transform?.y ?? 0) + position.y,
    scaleX: 1,
    scaleY: 1,
  };



  const [size, setSize] = React.useState({ width, height});
  const [showDelete, setShowDelete] = React.useState(false);
  const [resizeOnly, setResizeOnly] = React.useState(false);

  // --- Resizing state ---
  const [resizing, setResizing] = React.useState(false);
  const [startPos, setStartPos] = React.useState<{ x: number; y: number } | null>(null);
  const [startSize, setStartSize] = React.useState<{ width: number; height: number } | null>(null);


  // --- Mouse down on resize handle ---
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: size.width, height: size.height });
  };

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

  // --- Context menu and mouse leave logic ---
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDelete(true);
  };

  const handleMouseLeave = () => {
    setResizeOnly(false);
    setShowDelete(false);
  };

  const [hovered, setHovered] = React.useState(false);
  const chairStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: size.width,
    height: size.height,
    borderRadius: 10,
    border: selected ? '2px solid #ff9800' : '1px solid black',
    boxShadow: selected ? '0 0 8px #ff9800' : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    transform: `${CSS.Translate.toString(finalTransform)} rotate(${rotation}deg)`,
    background: '#fff',
    transition: 'box-shadow 0.2s, border 0.2s',
  };

  return (
    <>
    <div
          ref={setNodeRef}
          style={chairStyle}
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
      {showDelete && !viewOnly &&!resizeOnly && (
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
          >
            ↻
          </button>
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
            background: '#3973db',
            borderRadius: 4,
            cursor: 'nwse-resize',
            zIndex: 20,
          }}
          onMouseDown={handleResizeMouseDown}
          title="Resize"
        />
      )}
    </div>
    
    </>
  );
};

export default ChairLayout;