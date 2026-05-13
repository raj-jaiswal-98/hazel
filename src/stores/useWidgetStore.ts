import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface WidgetState {
  positions: Record<string, WidgetPosition>;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  resetPositions: () => void;
}

/**
 * Persists the positions of draggable dashboard widgets in localStorage
 * and handles auto-healing / collision detection.
 */
export const useWidgetStore = create<WidgetState>()(
  persist(
    (set, get) => ({
      positions: {},
      
      updatePosition: (id, x, y) => {
        const state = get();
        const otherIds = Object.keys(state.positions).filter(pid => pid !== id);
        
        let safeX = x;
        let safeY = y;
        const currentWidget = state.positions[id];
        const w = currentWidget?.width || 400;
        const h = currentWidget?.height || 200;

        // Auto-heal overlap (simple vertical nudge)
        let hasOverlap = true;
        let attempts = 0;
        while (hasOverlap && attempts < 10) {
          hasOverlap = false;
          for (const oid of otherIds) {
            const other = state.positions[oid];
            if (!other.width || !other.height) continue;

            // Collision check
            const overlapX = Math.abs(safeX - other.x) * 2 < (w + other.width);
            const overlapY = Math.abs(safeY - other.y) * 2 < (h + other.height);

            if (overlapX && overlapY) {
              safeY += other.height + 20; // Nudge down
              hasOverlap = true;
              break;
            }
          }
          attempts++;
        }

        set((state) => ({
          positions: {
            ...state.positions,
            [id]: { ...state.positions[id], x: safeX, y: safeY }
          }
        }));
      },

      updateSize: (id, width, height) => set((state) => ({
        positions: {
          ...state.positions,
          [id]: { ...(state.positions[id] || { x: 0, y: 0 }), width, height }
        }
      })),

      resetPositions: () => set({ positions: {} }),
    }),
    {
      name: 'bloom-widget-positions',
    }
  )
);
