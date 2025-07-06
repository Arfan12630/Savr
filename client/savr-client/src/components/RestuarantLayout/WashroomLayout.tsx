import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import BathroomIcon from '@mui/icons-material/Bathroom';
import Box from '@mui/joy/Box';

const WashroomLayout = ({
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const [size, setSize] = React.useState({ width, height });
  const [resizing, setResizing] = React.useState(false);
  const [startPos, setStartPos] = React.useState<{ x: number; y: number } | null>(null);
  const [startSize, setStartSize] = React.useState<{ width: number; height: number } | null>(null);

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
        const newWidth = Math.max(40, startSize.width + dx);
        const newHeight = Math.max(40, startSize.height + dy);

        setSize({ width: newWidth, height: newHeight });
        onResize?.(id, newWidth, newHeight);
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

  const finalTransform = {
    x: (transform?.x ?? 0) + position.x,
    y: (transform?.y ?? 0) + position.y,
    scaleX: 1,
    scaleY: 1,
  };
  const isActuallyDragging = !!(transform && (transform.x !== 0 || transform.y !== 0));
  const style: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: size.width,
    height: size.height,
    borderRadius: shape === 'circle' ? '50%' : 0,
    border: selected ? '2px solid #ff9800' : '2.5px solid #274b8f',
    boxShadow: selected ? '0 0 8px #ff9800' : '0 4px 16px rgba(57, 115, 219, 0.10)',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    transform: CSS.Translate.toString(finalTransform) + ` rotate(${rotation}deg)`,
    transition: isActuallyDragging
      ? 'none'
      : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, border 0.2s, background 0.2s',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => { /* show delete/rotate if needed */ }}
      onMouseLeave={() => { /* hide delete/rotate if needed */ }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          p: 0,
          m: 0,
        }}
      >
        <BathroomIcon
          sx={{
            width: '100%',
            height: '100%',
            fontSize: 'inherit',
            color: '#1976d2',
          }}
          fontSize="inherit"
        />
      </Box>
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

export default WashroomLayout;
