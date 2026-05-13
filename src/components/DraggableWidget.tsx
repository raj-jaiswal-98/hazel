import { motion, useDragControls } from 'framer-motion';
import { useWidgetStore } from '../stores/useWidgetStore';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DraggableWidget({ id, children, className = '' }: DraggableWidgetProps) {
  const { positions, updatePosition, updateSize } = useWidgetStore();
  const [isDragging, setIsDragging] = useState(false);
  const initialPos = positions[id] || { x: 0, y: 0 };
  const controls = useDragControls();
  const ref = useRef<HTMLDivElement>(null);

  // Track size for collision detection
  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      updateSize(id, width, height);
    }
  }, [id, updateSize]);

  return (
    <motion.div
      ref={ref}
      drag
      dragControls={controls}
      dragMomentum={false}
      dragListener={false}
      initial={{ x: initialPos.x, y: initialPos.y }}
      animate={{ x: (positions[id] || initialPos).x, y: (positions[id] || initialPos).y }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        const newX = initialPos.x + info.offset.x;
        const newY = initialPos.y + info.offset.y;
        updatePosition(id, newX, newY);
      }}
      className={`relative group cursor-default ${className}`}
      style={{ 
        touchAction: 'none',
        zIndex: isDragging ? 1000 : 10 
      }}
    >
      {/* Drag Handle */}
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="absolute -top-2 -left-2 w-8 h-8 rounded-full glass glass-hover opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-move transition-opacity z-50 scale-75"
        title="Drag to reposition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-bloom-glow-blue">
          <polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      </div>

      {children}
    </motion.div>
  );
}
