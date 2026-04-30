import { motion } from 'framer-motion';

const lines = [
  { id: 'S-4', eff: 98.5 },
  { id: 'S-7', eff: 96.2 },
  { id: 'S-1', eff: 95.0 },
  { id: 'S-9', eff: 92.8 },
  { id: 'S-2', eff: 91.5 },
  { id: 'S-3', eff: 89.4 },
  { id: 'S-8', eff: 88.0 },
  { id: 'S-10',eff: 85.5 },
  { id: 'S-5', eff: 82.1 },
  { id: 'S-6', eff: 78.9 },
];

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12"
      initial={{ opacity: 0, y: 100, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ perspective: '1000px' }}
    >
      <div className="w-full max-w-4xl">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-[#60a5fa] font-mono tracking-widest uppercase text-sm mb-1">Performance Ranking</h2>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Line Efficiency (Top 10)</h1>
        </motion.div>

        <div className="flex flex-col gap-4">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <motion.span 
                className="w-12 text-right font-mono font-bold text-[#f1f5f9]/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                {line.id}
              </motion.span>
              
              <div className="flex-1 h-8 bg-[#1a2236] rounded-sm overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#3b5bdb] to-[#60a5fa]"
                  initial={{ width: 0 }}
                  animate={{ width: `${line.eff}%` }}
                  transition={{ duration: 1.2, delay: 0.4 + idx * 0.05, ease: "easeOut" }}
                />
                
                {/* Ambient glow on bar */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-20 bg-white/20 blur-md"
                  initial={{ left: '-20%' }}
                  animate={{ left: '120%' }}
                  transition={{ duration: 2, delay: 1 + idx * 0.2, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>
              
              <motion.span 
                className="w-16 font-mono font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + idx * 0.05 }}
              >
                {line.eff.toFixed(1)}%
              </motion.span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background scanline effect */}
      <motion.div 
        className="absolute left-0 right-0 h-[2px] bg-[#60a5fa]/50 shadow-[0_0_15px_#60a5fa] pointer-events-none z-20"
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
