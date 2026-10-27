import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function Book({ pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col items-center select-none">
      
      {/* 3D-Оболочка книги */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-h-[82vh] min-h-[560px] flex items-center justify-center perspective-[2000px]">
        
        {/* Кнопка: Назад */}
        <button
          type="button"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="cursor-pointer hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#120e0b]/90 border border-amber-600/40 hover:border-amber-400 hover:bg-amber-500 hover:text-black text-amber-400 items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Объемное тело книги */}
        <div className="relative w-full h-full rounded-2xl bg-[#090706] border-2 border-amber-900/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex">
          
          {/* Корешок фолианта по центру (для широких экранов) */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/80 via-amber-950/30 to-black/80 z-30 pointer-events-none border-x border-black/50" />
          
          {/* Золоченый обрез книги снизу */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-900/20 via-amber-600/40 to-amber-900/20 z-30 pointer-events-none" />

          {/* Контент текущей страницы с 3D-анимацией переворота */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, rotateY: -15, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 15, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative z-10 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-5 sm:p-8 md:p-10"
            >
              {/* Верхний колонтитул страницы */}
              <div className="flex justify-between items-center text-[10px] font-sans tracking-[0.25em] text-amber-500/60 uppercase border-b border-amber-900/25 pb-3">
                <span className="font-semibold text-amber-200/80">Sharmino & Istanbul</span>
                <span className="bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40 text-amber-400 font-bold">
                  {currentPage + 1} / {totalPages}
                </span>
              </div>

              {/* Тело страницы */}
              <div className="my-auto py-3">
                {pages[currentPage]}
              </div>

              {/* Нижний колонтитул */}
              <div className="flex justify-between items-center text-[9px] font-sans text-zinc-500 uppercase tracking-widest border-t border-amber-900/20 pt-2.5">
                <span>Гастрономический вечер • Рататуй</span>
                <span className="text-amber-500/60">Шарм-эль-Шейх • 3 Ноября</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Кнопка: Вперед */}
        <button
          type="button"
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="cursor-pointer hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#120e0b]/90 border border-amber-600/40 hover:border-amber-400 hover:bg-amber-500 hover:text-black text-amber-400 items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Панель навигации под книгой */}
      <div className="mt-4 flex items-center gap-5 bg-zinc-950/90 border border-amber-900/40 px-5 py-2 rounded-full backdrop-blur-md shadow-xl text-xs font-sans">
        <button 
          type="button"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="cursor-pointer flex items-center gap-1 text-amber-400 hover:text-amber-300 disabled:opacity-25 disabled:cursor-not-allowed uppercase tracking-wider font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Назад
        </button>

        <div className="flex items-center gap-2 text-zinc-400 border-x border-zinc-800 px-4">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px]">Разворот {currentPage + 1} из {totalPages}</span>
        </div>

        <button 
          type="button"
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="cursor-pointer flex items-center gap-1 text-amber-400 hover:text-amber-300 disabled:opacity-25 disabled:cursor-not-allowed uppercase tracking-wider font-semibold"
        >
          Вперед <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}