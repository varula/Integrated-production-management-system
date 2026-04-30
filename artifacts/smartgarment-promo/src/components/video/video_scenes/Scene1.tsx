import { motion } from 'framer-motion';

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <motion.div 
          className="absolute -inset-8 border border-[#3b5bdb]/30 rounded-xl"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div 
          className="absolute -inset-12 border border-[#60a5fa]/20 rounded-xl"
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <h1 className="text-8xl md:text-[8vw] font-bold text-[#f1f5f9] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          {'SmartGarment'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 + i * 0.05 }}
              style={{ transformOrigin: 'bottom' }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
      </div>
      
      <motion.p
        className="mt-8 text-2xl text-[#60a5fa] tracking-widest uppercase font-mono"
        initial={{ opacity: 0, y: 20, letterSpacing: '0em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.2em' }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        Factory Production Management
      </motion.p>
      
      {/* Animated circuit lines */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[2px] h-32 bg-gradient-to-t from-transparent to-[#3b5bdb]"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
}
