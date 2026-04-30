import { motion } from 'framer-motion';

export function Scene6() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0d1117]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Massive logo reveal */}
        <motion.div
          className="w-32 h-32 border-4 border-[#3b5bdb] rounded-2xl mb-8 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180, borderRadius: '50%' }}
          animate={{ scale: 1, rotate: 0, borderRadius: '1rem' }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#60a5fa] rounded-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <h1 className="text-7xl font-bold text-white mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          {'SmartGarment'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-2xl text-[#60a5fa] font-mono tracking-widest uppercase mb-16"
          initial={{ opacity: 0, clipPath: 'inset(0 50% 0 50%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
          transition={{ duration: 1, delay: 2 }}
        >
          Every Thread Counts.
        </motion.p>

        {/* Summary stats */}
        <motion.div 
          className="flex gap-16 border-t border-[#3b5bdb]/30 pt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>+24%</div>
            <div className="text-sm text-[#f1f5f9]/60 font-mono">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>-15%</div>
            <div className="text-sm text-[#f1f5f9]/60 font-mono">Defect Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>100%</div>
            <div className="text-sm text-[#f1f5f9]/60 font-mono">Visibility</div>
          </div>
        </motion.div>
      </div>

      {/* Ambient background pulsing for the outro */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle at center, #3b5bdb 0%, transparent 60%)', opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.05, 0.1] }}
        transition={{ duration: 4, delay: 1, repeat: Infinity }}
      />
    </motion.div>
  );
}
