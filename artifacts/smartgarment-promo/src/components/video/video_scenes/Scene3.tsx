import { motion } from 'framer-motion';

const lines = [
  ...Array.from({ length: 10 }).map((_, i) => ({ type: 'Sewing', id: `S-${i+1}`, status: Math.random() > 0.2 ? 'running' : 'down' })),
  ...Array.from({ length: 3 }).map((_, i) => ({ type: 'Finishing', id: `F-${i+1}`, status: i === 1 ? 'idle' : 'running' }))
];

export function Scene3() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12"
      initial={{ opacity: 0, scale: 1.1, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -50 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="w-full max-w-6xl mb-8 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h2 className="text-[#60a5fa] font-mono tracking-widest uppercase text-sm mb-1">Floor Map</h2>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Production Floor Status</h1>
        </div>
        <div className="flex gap-4 text-sm font-mono">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10b981]"></span> Running</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#facc15]"></span> Idle</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]"></span> Down</div>
        </div>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-5 gap-4">
        {lines.map((line, idx) => {
          const isRunning = line.status === 'running';
          const isIdle = line.status === 'idle';
          const isDown = line.status === 'down';
          
          let color = '#10b981';
          if (isIdle) color = '#facc15';
          if (isDown) color = '#ef4444';

          return (
            <motion.div
              key={idx}
              className="bg-[#1a2236]/80 backdrop-blur-sm border border-[#3b5bdb]/20 rounded-lg p-4 flex flex-col justify-between h-32 relative overflow-hidden"
              initial={{ opacity: 0, rotateX: -45, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformOrigin: 'top' }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[#60a5fa] font-bold text-xl">{line.id}</span>
                <motion.div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ scale: isDown ? [1, 1.2, 1] : 1, opacity: isDown ? [1, 0.5, 1] : 1 }}
                  transition={isDown ? { duration: 1, repeat: Infinity } : {}}
                />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#f1f5f9]/60 text-sm font-mono">{line.type}</span>
                <span className="text-white font-mono font-bold">{isRunning ? '100%' : isIdle ? '0%' : 'ERR'}</span>
              </div>
              
              {/* Progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: isRunning ? '100%' : isIdle ? '10%' : '30%' }}
                  transition={{ delay: 0.5 + idx * 0.05, duration: 1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Ambient background pulsing */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-t from-[#3b5bdb]/10 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
