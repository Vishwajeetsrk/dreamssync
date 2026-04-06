'use client';

import { motion } from 'framer-motion';

interface IkigaiDiagramProps {
  activeZone?: 'passion' | 'profession' | 'mission' | 'vocation' | 'ikigai' | null;
  onHoverZone?: (zone: string | null) => void;
}

export function IkigaiDiagram({ activeZone, onHoverZone }: IkigaiDiagramProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } },
  };

  const circleVariants = (delay: number) => ({
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 0.2, scale: 1, transition: { delay, duration: 0.8, type: "spring" as const } },
    hover: { opacity: 0.4, scale: 1.05, transition: { duration: 0.3 } },
    active: { opacity: 0.5, scale: 1, transition: { duration: 0.3 } },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center p-8 overflow-visible"
    >
      {/* 4 Overlapping Circles */}
      
      {/* LOVE (Top-Right) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border-4 border-black bg-rose-500 flex items-center justify-center cursor-help transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
        style={{ top: '15%', right: '15%', zIndex: 1 }}
        animate={activeZone === 'passion' ? 'active' : 'visible'}
        variants={circleVariants(0.1)}
        onMouseEnter={() => onHoverZone?.('passion')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-black uppercase text-[10px] md:text-xs">❤️ Love</div>
      </motion.div>

      {/* SKILLS (Top-Left) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border-4 border-black bg-emerald-500 flex items-center justify-center cursor-help transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
        style={{ top: '15%', left: '15%', zIndex: 1 }}
        animate={activeZone === 'profession' ? 'active' : 'visible'}
        variants={circleVariants(0.2)}
        onMouseEnter={() => onHoverZone?.('profession')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-black uppercase text-[10px] md:text-xs">💪 Good At</div>
      </motion.div>

      {/* MARKET (Bottom-Left) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border-4 border-black bg-indigo-500 flex items-center justify-center cursor-help transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
        style={{ bottom: '15%', left: '15%', zIndex: 1 }}
        animate={activeZone === 'mission' ? 'active' : 'visible'}
        variants={circleVariants(0.3)}
        onMouseEnter={() => onHoverZone?.('mission')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-black uppercase text-[10px] md:text-xs">🌍 World Needs</div>
      </motion.div>

      {/* INCOME (Bottom-Right) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border-4 border-black bg-amber-500 flex items-center justify-center cursor-help transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
        style={{ bottom: '15%', right: '15%', zIndex: 1 }}
        animate={activeZone === 'vocation' ? 'active' : 'visible'}
        variants={circleVariants(0.4)}
        onMouseEnter={() => onHoverZone?.('vocation')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-black uppercase text-[10px] md:text-xs">💰 Paid For</div>
      </motion.div>

      {/* IKIGAI - The Center Intersection */}
      <motion.div
        className="absolute w-1/4 h-1/4 rounded-full border-4 border-black bg-black text-white flex items-center justify-center cursor-pointer z-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 1, duration: 0.5, type: "spring" } }}
        whileHover={{ scale: 1.2, rotate: 15 }}
        onMouseEnter={() => onHoverZone?.('ikigai')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center">
          <div className="font-black text-[10px] md:text-sm tracking-tighter uppercase leading-none">IKIGAI</div>
          <div className="text-[10px] font-bold opacity-70">Core</div>
        </div>
      </motion.div>

      {/* Helper arrows for zones between circles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Lines connecting circles */}
      </div>
    </motion.div>
  );
}
