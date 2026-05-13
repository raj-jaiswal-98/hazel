import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Anime-style Buddy Component
 * Handles expressive animations and state-based visuals
 */
export function BuddyComponent() {
  const [buddyPos, setBuddyPos] = useState({ x: 0, y: 0 });
  const [buddyState, setBuddyState] = useState('idle');
  
  // Connect to the canvas engine to get the buddy's position and state
  useEffect(() => {
    const updateBuddy = () => {
      const engine = (window as any).__BUDDY_ENGINE__;
      if (engine) {
        setBuddyPos({ x: engine.pos.x, y: engine.pos.y });
        setBuddyState(engine.state);
      }
      requestAnimationFrame(updateBuddy);
    };
    
    const raf = requestAnimationFrame(updateBuddy);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (buddyPos.x === 0) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{ overflow: 'hidden' }}
    >
      <motion.div
        className="relative"
        animate={{ 
          x: buddyPos.x - 20, 
          y: buddyPos.y - 20,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.5 }}
      >
        {/* Glow Aura */}
        <div className="absolute inset-0 bg-bloom-glow-blue/20 blur-xl rounded-full scale-150" />
        
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          initial={false}
          animate={buddyState}
        >
          {/* Main Body */}
          <motion.path
            d="M20,5 C30,5 35,15 35,25 C35,35 30,38 20,38 C10,38 5,35 5,25 C5,15 10,5 20,5 Z"
            fill="rgba(167, 139, 250, 0.9)"
            variants={{
              idle: { scaleY: 1, scaleX: 1 },
              preparing_jump: { scaleY: 0.7, scaleX: 1.3, y: 5 },
              jumping: { scaleY: 1.4, scaleX: 0.8, y: -10 },
              sleep: { scaleY: 0.8, scaleX: 1.1, opacity: 0.6 }
            }}
          />

          {/* Eyes */}
          <AnimatePresence mode="wait">
            {buddyState === 'sleep' ? (
              <motion.g
                key="sleep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Closed eyes - Zzz */}
                <path d="M12,20 L18,20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <path d="M22,20 L28,20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </motion.g>
            ) : (
              <motion.g
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Expressive eyes */}
                <motion.circle 
                  cx="15" cy="20" fill="white" 
                  initial="idle"
                  animate={buddyState}
                  variants={{
                    idle: { r: 2.5 },
                    preparing_jump: { r: 2.2 },
                    jumping: { r: 3.5 },
                    sleep: { r: 0 } // Covered by path in sleep state
                  }}
                />
                <motion.circle 
                  cx="25" cy="20" fill="white"
                  initial="idle"
                  animate={buddyState}
                  variants={{
                    idle: { r: 2.5 },
                    preparing_jump: { r: 2.2 },
                    jumping: { r: 3.5 },
                    sleep: { r: 0 }
                  }}
                />
                
                {/* Shine in eyes */}
                <circle cx="16" cy="19" r="0.8" fill="rgba(255,255,255,0.8)" />
                <circle cx="26" cy="19" r="0.8" fill="rgba(255,255,255,0.8)" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Blush (Only when playing/jumping) */}
          {buddyState === 'jumping' && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              <ellipse cx="10" cy="25" rx="3" ry="1.5" fill="#ff9999" />
              <ellipse cx="30" cy="25" rx="3" ry="1.5" fill="#ff9999" />
            </motion.g>
          )}
        </motion.svg>

        {/* Floating Zzz for sleep state */}
        {buddyState === 'sleep' && (
          <motion.div
            className="absolute -top-4 -right-2 text-[10px] font-bold text-white/40"
            animate={{ 
              y: [-5, -15], 
              x: [0, 5], 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Zzz
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
