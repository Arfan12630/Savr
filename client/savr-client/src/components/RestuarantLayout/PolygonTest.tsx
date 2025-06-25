import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface PolygonTestProps {
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
  initialPoints?: Point[];
}

const PolygonTest: React.FC<PolygonTestProps> = ({
  label,
  top,
  left,
  width,
  height,
  initialPoints = [
    { x: 0, y: 0 },
    { x: 300, y: 0 },
    { x: 300, y: 120 },
    { x: 240, y: 200 },
    { x: 0, y: 200 },
  ],
}) => {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draggingZone, setDraggingZone] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (draggingIndex !== null) {
        const clampedX = Math.max(0, Math.min(x, width));
        const clampedY = Math.max(0, Math.min(y, height));
        const newPoints = [...points];
        newPoints[draggingIndex] = { x: clampedX, y: clampedY };
        setPoints(newPoints);
      } else if (draggingZone && dragStart) {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;
        const movedPoints = points.map(p => ({ x: p.x + dx, y: p.y + dy }));
        setPoints(movedPoints);
        setDragStart({ x, y });
      }
    };

    const handleMouseUp = () => {
      setDraggingIndex(null);
      setDraggingZone(false);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIndex, points, width, height, draggingZone, dragStart]);

  const pointString = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ position: 'absolute', top, left, zIndex: 10, overflow: 'visible' }}
    >
      <polygon
        points={pointString}
        fill="#f1f1f1"
        stroke="#ccc"
        strokeWidth={1.5}
        onMouseDown={(e) => {
          const rect = svgRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setDraggingZone(true);
          setDragStart({ x, y });
        }}
        style={{ cursor: 'move' }}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={6}
          fill="blue"
          style={{ cursor: 'pointer' }}
          onMouseDown={() => setDraggingIndex(i)}
        />
      ))}
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize="16"
        fill="#333"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </svg>
  );
};

export default PolygonTest;

/*
Usage Example:
<PolygonTest label="Kitchen" top={100} left={100} width={300} height={200} />
*/
