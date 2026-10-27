import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Utensils, Wine, X } from 'lucide-react';
import { menuData } from '../data/menu';

export default function Menu({ t }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courses = menuData.syncCourses;
  const currentDish = courses[currentIdx];

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % courses.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + courses.length) % courses.length);
  };

  return (
    <div className="relative w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col justify-between py-1 px-2 sm:px-4 h-full max-h-[88dvh] select-none">
      
      {/* ДОВОЛЬНАЯ ГОЛОВА РЕМИ: ПОДНЯТА НА 90px ВВЕРХ, УВЕДЕНА В ФОН */}
      <div className="absolute -top-16 sm:-top-24 md:-top-28 left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-80 pointer-events-none opacity-35 z-0">
        <img 
          src="/remi.png" 
          alt="" 
          className="w-full h-auto object-contain mix-blend-screen filter drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)'
          }}
        />
      </div>

      {/* 1. ЗАГОЛОВОК СЕКЦИИ */}
      <div className="relative z-10 text-center flex flex-col items-center shrink-0 pt-1 sm:pt-2">
        <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.35em] text-amber-500 font-sans font-bold drop-shadow">
          Cuisine Synchronisée
        </span>
        <h3 className="text-xl sm:text-3xl md:text-4xl text-amber-100 font-bold font-serif leading-tight mt-0.5">
          {t?.menuTitle || "Меню от Реми"}
        </h3>
      </div>

      {/* 2. ТАБЫ ПОДАЧ (#1 - #6) */}
      <div className="relative z-10 flex justify-center items-center gap-1 sm:gap-2 my-2 sm:my-3 overflow-x-auto py-0.5 px-1 no-scrollbar shrink-0">
        {courses.map((dish, i) => (
          <button
            key={dish.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIdx(i);
            }}
            className={`cursor-pointer px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-sans transition-all duration-200 border flex items-center gap-1 shrink-0 ${
              currentIdx === i
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-amber-700/60 hover:text-amber-200'
            }`}
          >
            <span className="opacity-60 text-[9px]">#{i + 1}</span>
            <span>{dish.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* 3. КАРТОЧКА БЛЮДА */}
      <div className="relative z-10 flex-1 min-h-0 bg-[#0d0a08]/95 border border-amber-500/35 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.98)] backdrop-blur-xl flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDish.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center h-full"
          >
            {/* Фото блюда */}
            <div className="md:col-span-6 h-44 sm:h-56 md:h-[320px] lg:h-[360px] w-full rounded-xl sm:rounded-2xl overflow-hidden relative border border-amber-500/40 shadow-2xl bg-black shrink-0">
              <img 
                src={currentDish.image} 
                alt={currentDish.name}
                className="w-full h-full object-cover object-center scale-[1.35] transition-transform duration-700 hover:scale-[1.42]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold text-amber-300 border border-amber-600/40 shadow-lg">
                {currentDish.weight}
              </div>
            </div>

            {/* Описание */}
            <div className="md:col-span-6 flex flex-col justify-between h-full py-0.5 sm:py-2">
              <div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-widest text-amber-500 font-sans font-bold mb-0.5">
                  Курс {currentDish.id} из {courses.length} • {currentDish.title}
                </div>
                <h4 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-amber-50 leading-tight mb-1 sm:mb-2">
                  {currentDish.name}
                </h4>
                <p className="text-[11px] sm:text-xs md:text-sm text-zinc-300 font-sans leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {currentDish.desc}
                </p>
              </div>

              <div className="mt-2 sm:mt-4 p-2 sm:p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex items-center gap-2.5 shrink-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                  <Wine className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] sm:text-xs font-sans text-zinc-300 truncate">
                  <span className="text-zinc-500 mr-1.5 font-bold uppercase text-[9px]">Пейринг:</span>
                  <span className="text-amber-200">{currentDish.pairing}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. ПАНЕЛЬ НАВИГАЦИИ СНИЗУ */}
      <div className="relative z-10 mt-2 sm:mt-3 flex items-center justify-between gap-2 max-w-md mx-auto w-full px-2 shrink-0">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Предыдущее блюдо"
          className="cursor-pointer h-9 px-3.5 rounded-xl bg-zinc-950 border border-amber-900/50 hover:border-amber-400 text-amber-300 hover:text-black hover:bg-amber-500 flex items-center gap-1 text-xs font-sans font-semibold transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Назад</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="cursor-pointer h-9 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-950/70 to-zinc-950 border border-amber-700/60 hover:border-amber-400 text-amber-200 hover:text-white flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <Utensils className="w-3 h-3 text-amber-400" />
          <span>3 блюда на столе</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Следующее блюдо"
          className="cursor-pointer h-9 px-3.5 rounded-xl bg-zinc-950 border border-amber-900/50 hover:border-amber-400 text-amber-300 hover:text-black hover:bg-amber-500 flex items-center gap-1 text-xs font-sans font-semibold transition-all active:scale-95 shadow-md"
        >
          <span className="hidden sm:inline">Вперед</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. МОДАЛКА ЗАКУСОК СТОЛА */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#110e0c] border border-amber-600/40 rounded-3xl p-4 sm:p-6 shadow-2xl max-h-[88vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-3.5 pb-2.5 border-b border-amber-900/30">
                <div>
                  <span className="text-[9px] font-sans uppercase tracking-widest text-amber-500 font-bold block">
                    Sur la table
                  </span>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                    На столе на протяжении всего сеанса
                  </h4>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {menuData.tableBase.map((item) => (
                  <div key={item.id} className="p-2 sm:p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-amber-900/40">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h5 className="font-serif font-bold text-amber-100 text-xs sm:text-sm truncate">
                          {item.name}
                        </h5>
                        <span className="text-[10px] font-sans text-amber-400 font-semibold shrink-0 ml-2">
                          {item.weight}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-600 font-sans font-medium mb-0.5">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans leading-snug line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-colors shadow-lg"
              >
                Вернуться к меню
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}