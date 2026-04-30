import { motion } from 'framer-motion';

const hourlyData = [
  { hour: '8a', target: 500, actual: 480 },
  { hour: '9a', target: 500, actual: 510 },
  { hour: '10a', target: 500, actual: 495 },
  { hour: '11a', target: 500, actual: 520 },
  { hour: '12p', target: 500, actual: 450 },
  { hour: '1p', target: 500, actual: 505 },
  { hour: '2p', target: 500, actual: 530 },
  { hour: '3p', target: 500, actual: 490 },
  { hour: '4p', target: 500, actual: 470 },
  { hour: '5p', target: 500, actual: 515 },
];

export function Scene4() {
  const maxVal = Math.max(...hourlyData.map(d => Math.max(d.target, d.actual)));

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-12"
      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
      exit={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full max-w-6xl grid grid-cols-3 gap-8">
        {/* Left Column: Bar Chart */}
        <div className="col-span-2 bg-[#1a2236]/80 backdrop-blur-sm border border-[#3b5bdb]/20 rounded-xl p-8 flex flex-col h-[60vh]">
          <h2 className="text-xl text-[#60a5fa] font-mono tracking-widest uppercase mb-8">Hourly Output vs Target</h2>
          
          <div className="flex-1 flex items-end justify-between gap-2 relative border-b border-[#f1f5f9]/10 pb-4">
            {/* Target line */}
            <motion.div 
              className="absolute left-0 right-0 border-t border-dashed border-[#facc15]/50 z-0"
              style={{ bottom: 'calc(500 / 600 * 100% + 16px)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
            
            {hourlyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 z-10">
                <div className="w-full flex justify-center items-end h-[40vh] gap-1 relative">
                  {/* Target Bar */}
                  <motion.div 
                    className="w-1/3 bg-[#3b5bdb]/30 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.target / maxVal) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                  />
                  {/* Actual Bar */}
                  <motion.div 
                    className="w-1/3 bg-[#60a5fa] rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.actual / maxVal) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.05, type: 'spring' }}
                  />
                </div>
                <span className="text-[#f1f5f9]/60 font-mono text-sm">{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pie Chart / Quality */}
        <div className="col-span-1 flex flex-col gap-8">
          <div className="flex-1 bg-[#1a2236]/80 backdrop-blur-sm border border-[#3b5bdb]/20 rounded-xl p-8 flex flex-col items-center justify-center relative">
            <h2 className="absolute top-8 left-8 text-xl text-[#60a5fa] font-mono tracking-widest uppercase">Quality Split</h2>
            
            <div className="relative w-48 h-48 mt-8">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Defect slice */}
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * 0.058) }} // 5.8% defect
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                />
                {/* RFT slice */}
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 0.058)} // Start where defect ends
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: `${251.2 * 0.942} 251.2` }} // 94.2% RFT
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <motion.span 
                  className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, type: "spring" }}
                >
                  94.2%
                </motion.span>
                <motion.span 
                  className="text-sm font-mono text-[#10b981]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  RFT
                </motion.span>
              </div>
            </div>
            
            <div className="w-full mt-8 flex justify-center gap-6">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#10b981]"></span><span className="font-mono text-sm">Pass</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#ef4444]"></span><span className="font-mono text-sm">Defect</span></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background drift */}
      <motion.div 
        className="absolute inset-0 bg-[#3b5bdb]/5 pointer-events-none -z-10"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
    </motion.div>
  );
}
