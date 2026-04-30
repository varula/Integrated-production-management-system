import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const kpis = [
  { label: "Today's Output", value: "4,280", sub: "/ 5,000 target", color: "var(--color-primary)", delay: 0.2 },
  { label: "RFT", value: "94.2%", sub: "+1.2% vs avg", color: "var(--color-success)", delay: 0.4 },
  { label: "DHU", value: "1.8%", sub: "-0.5% vs avg", color: "var(--color-success)", delay: 0.6 },
  { label: "Lines Running", value: "8/10", sub: "2 idle", color: "var(--color-warning)", delay: 0.8 },
];

export function Scene2() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-full max-w-6xl mb-12 flex justify-between items-end border-b border-[#3b5bdb]/30 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h2 className="text-xl text-[#60a5fa] font-mono tracking-widest uppercase mb-2">Live Dashboard</h2>
          <h1 className="text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Global Production</h1>
        </div>
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-3 h-3 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-red-500 font-mono">LIVE • {new Date().toISOString().substring(11, 19)}</span>
        </div>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            className="bg-[#1a2236] border border-[#3b5bdb]/20 rounded-xl p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: kpi.delay, type: "spring", bounce: 0.4 }}
          >
            {/* Top accent line */}
            <motion.div 
              className="absolute top-0 left-0 h-1"
              style={{ backgroundColor: kpi.color }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: kpi.delay + 0.3 }}
            />
            
            <h3 className="text-[#60a5fa] text-sm uppercase tracking-wider mb-4">{kpi.label}</h3>
            
            <div className="flex items-baseline gap-2">
              <motion.div
                className="text-5xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: kpi.delay + 0.2 }}
              >
                {kpi.label === "Today's Output" ? `4,${(200 + count * 3).toString().padStart(3, '0')}` : kpi.value}
              </motion.div>
            </div>
            
            <motion.p 
              className="text-[#f1f5f9]/50 text-sm mt-2 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: kpi.delay + 0.5 }}
            >
              {kpi.sub}
            </motion.p>
            
            {/* Background subtle number */}
            <div className="absolute -right-4 -bottom-4 text-8xl font-bold text-white/[0.02] pointer-events-none select-none" style={{ fontFamily: 'var(--font-display)' }}>
              {idx + 1}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Background drifting element to keep motion alive */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle at 50% 50%, var(--color-primary) 0%, transparent 50%)' }}
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
