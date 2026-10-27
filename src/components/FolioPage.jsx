import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FolioPage({ 
  children, 
  folioNumber, 
  folioTitle, 
  index, 
  total = 6, 
  beamClass, 
  bgClass = "bg-[#0b0908]" 
}) {
  const containerRef = useRef(null);

  // Отслеживаем прохождение страницы относительно вьюпорта
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Физика ухода листа вглубь стопки
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.85], [0, 0.75]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen"
      style={{ zIndex: index }}
    >
      <motion.div
        style={{
          scale,
          y: yOffset,
          transformOrigin: "center top"
        }}
        className={`sticky top-0 min-h-screen w-full flex flex-col justify-between ${bgClass} border-t-2 border-amber-500/40 shadow-[0_-30px_90px_rgba(0,0,0,0.98)] px-4 sm:px-8 md:px-14 py-6 md:py-8 will-change-transform`}
      >
        {/* Затемняющая тень при наплыве следующего листа */}
        <motion.div 
          style={{ opacity: shadowOpacity }}
          className="absolute inset-0 bg-black pointer-events-none z-30 transition-opacity"
        />

        {/* Корешок фолианта слева (декоративная тень переплета) */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/80 via-amber-950/20 to-transparent pointer-events-none hidden md:block z-20" />

        {/* Направленный свет разворота */}
        <div className={`absolute pointer-events-none ${beamClass}`} />

        {/* Верхний колонтитул страницы */}
        <div className="relative z-20 flex justify-between items-center text-[10px] md:text-xs font-sans tracking-[0.25em] text-amber-500/60 uppercase select-none pb-3 border-b border-amber-900/25">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-200/80">Sharmino & Istanbul</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-500">{folioTitle}</span>
            <span className="text-amber-500 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
              {folioNumber} • {index}/{total}
            </span>
          </div>
        </div>

        {/* Основной контент разворота */}
        <div className="relative z-20 my-auto w-full py-4">
          {children}
        </div>

        {/* Нижний колонтитул с подсказкой листания */}
        <div className="relative z-20 flex justify-between items-center text-[9px] font-sans text-zinc-500 uppercase tracking-widest pt-3 border-t border-amber-900/15">
          <span>Old Town • 3 Ноября</span>
          <div className="flex items-center gap-1.5 text-amber-500/60">
            <span>Листать разворот</span>
            <span className="animate-bounce inline-block text-[11px]">↓</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}