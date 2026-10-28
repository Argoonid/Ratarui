import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SparkleField from './SparkleField';

export default function PageDeck({ chapters, lang = 'ru', t }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isLocked = useRef(false);
  const touchStartY = useRef(0);

  const paginate = (newDirection) => {
    if (isLocked.current) return;

    const nextIndex = index + newDirection;
    if (nextIndex >= 0 && nextIndex < chapters.length) {
      isLocked.current = true;
      setDirection(newDirection);
      setIndex(nextIndex);

      setTimeout(() => {
        isLocked.current = false;
      }, 700);
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < 25) return;
      if (e.deltaY > 0) paginate(1);
      else if (e.deltaY < 0) paginate(-1);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [index]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') paginate(1);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') paginate(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (diff > 45) paginate(1);
    else if (diff < -45) paginate(-1);
  };

  const pageVariants = {
    enter: (dir) => ({
      y: dir > 0 ? '100%' : '-100%',
      scale: 0.98,
      opacity: 0.4,
      filter: 'brightness(0.6)'
    }),
    center: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'brightness(1)',
      transition: {
        y: { type: 'spring', stiffness: 220, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.45 }
      }
    },
    exit: (dir) => ({
      y: dir > 0 ? '-16%' : '16%',
      scale: 0.92,
      opacity: 0.1,
      filter: 'brightness(0.2)',
      transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] }
    })
  };

  const currentChapter = chapters[index];

  // Локализованные строки навигационного футера
  const footerLocation = t?.deckFooterLocation || (
    lang === 'it' 
      ? 'Città Vecchia • Ristorante ISTANBUL' 
      : lang === 'en' 
        ? 'Old Town • ISTANBUL Restaurant' 
        : 'Старый Город • Ресторан ISTANBUL'
  );

  const footerScroll = t?.deckFooterScroll || (
    lang === 'it' ? 'Scorri verso il basso' : lang === 'en' ? 'Scroll down' : 'Листайте вниз'
  );

  const footerFinal = t?.deckFooterFinal || (
    lang === 'it' ? 'Fine' : lang === 'en' ? 'Finale' : 'Финал'
  );

  const navAriaLabel = lang === 'it' 
    ? 'Navigazione capitoli' 
    : lang === 'en' 
      ? 'Chapter navigation' 
      : 'Навигация по главам';

  return (
    <div 
      className="relative w-screen h-[100dvh] overflow-hidden bg-[#060505] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Правая нить прогресса с римскими цифрами */}
      <nav 
        aria-label={navAriaLabel}
        className="fixed right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3"
      >
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-900/40 to-transparent pointer-events-none" />

        {chapters.map((chap, i) => {
          const isActive = index === i;
          return (
            <button
              key={chap.id}
              type="button"
              onClick={() => {
                if (i !== index && !isLocked.current) {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }
              }}
              className="cursor-pointer group relative flex items-center justify-center p-1 transition-transform"
            >
              <span className="hidden md:block absolute right-8 px-2.5 py-1 rounded bg-[#100d0b] border border-amber-800/40 text-[10px] font-sans tracking-widest text-amber-200 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                {chap.roman} • {chap.title}
              </span>

              <div 
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'w-4 h-4 bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
                    : 'w-1.5 h-1.5 bg-zinc-700 group-hover:bg-amber-600'
                }`}
              >
                {isActive && (
                  <span className="text-[8px] font-sans font-bold leading-none">
                    {chap.roman}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Полноэкранный разворот главы */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.section
          key={currentChapter.id}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-[100dvh] flex flex-col justify-between pl-3 pr-8 sm:pl-6 sm:pr-12 md:px-16 pt-16 md:pt-20 pb-4 overflow-hidden will-change-transform"
        >
          {/* Световой луч главы */}
          <div className={`absolute pointer-events-none ${currentChapter.beamClass}`} />

          {/* Индивидуальное созвездие звёзд */}
          <SparkleField seed={currentChapter.id} />

          {/* Верхний колонтитул */}
          <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center text-[10px] md:text-xs font-sans tracking-[0.25em] text-amber-600/50 uppercase pb-2 border-b border-amber-900/20">
            <span className="font-semibold text-amber-200/70">Sharmino Events & Istanbul</span>
            <span className="text-amber-500 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
              {currentChapter.roman} • {index + 1} / {chapters.length}
            </span>
          </div>

          {/* Контент главы */}
          <div className="relative z-10 my-auto w-full max-w-6xl mx-auto flex flex-col justify-center items-center">
            {currentChapter.component}
          </div>

          {/* Нижний колонтитул */}
          <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center text-[9px] font-sans text-zinc-500 uppercase tracking-widest pt-2 border-t border-amber-900/15">
            <span>{footerLocation}</span>
            <div className="flex items-center gap-1.5 text-amber-500/60">
              <span>{index === chapters.length - 1 ? footerFinal : footerScroll}</span>
              {index < chapters.length - 1 && <span className="animate-bounce">↓</span>}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}