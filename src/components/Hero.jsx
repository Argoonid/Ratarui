import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Hero({ t }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-1 sm:py-2 px-4 select-none">
      
      {/* ПРИЗРАК ШЕФА ГЮСТО: РАЗОГНАН В МАСШТАБЕ, ТОРС РАСТВОРЕН В ТУМАНЕ */}
      <div className="relative -mb-6 sm:-mb-10 flex flex-col items-center z-10">
        
        {/* Янтарный софит за спиной */}
        <div className="absolute top-4 w-60 sm:w-80 md:w-[420px] h-60 sm:h-80 md:h-[420px] bg-gradient-to-b from-amber-500/30 via-amber-700/10 to-transparent rounded-full blur-3xl pointer-events-none transform -translate-y-6" />

        {/* Тонкий золотой ореол славы */}
        <div className="absolute top-8 w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border border-amber-500/25 pointer-events-none animate-pulse opacity-50" />

        {/* Крупная фигура: торс мягко растворяется в темноту и дым */}
        <div 
          className="relative w-52 sm:w-72 md:w-88 lg:w-[410px] transition-transform duration-700 hover:scale-105"
          style={{
            // Растворение нижней трети торса в ноль
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 96%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 96%)'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}gusteau.png`}
            alt="Auguste Gusteau" 
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
          />
        </div>

        {/* Дымка в точке перехода к тексту */}
        <div className="absolute bottom-2 inset-x-0 h-16 bg-gradient-to-t from-[#060505] via-[#060505]/70 to-transparent pointer-events-none" />
      </div>

      {/* НАДЗАГОЛОВОК, ВПЛЕТЕННЫЙ В СИЛУЭТ ШЕФА */}
      <div className="relative z-20 flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-[10px] sm:text-xs md:text-sm tracking-[0.35em] uppercase text-amber-400 font-sans font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {t?.heroSubtitle || "Sharmino Events & ISTANBUL Present"}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      </div>

      {/* ТИТУЛ ВЫСОКОГО ЗОЛОТА */}
      <h1 
        className="relative z-20 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-4 sm:mb-6 leading-[1.08] tracking-tight max-w-4xl"
        style={{
          background: 'linear-gradient(135deg, #FFF9DB 0%, #E6BF5A 35%, #FFF0B8 65%, #A87D24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 22px rgba(0,0,0,0.95))'
        }}
      >
        {t?.heroTitle || "Le Petit Chef: A Culinary Journey to Paris"}
      </h1>

      {/* ШТАМП ДАТЫ И ЦЕНЫ */}
      // В секции бейджа замени блок даты:
<div className="relative z-20 inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#0d0a08]/90 border border-amber-500/50 shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] backdrop-blur-md">
  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
  <span className="text-[11px] sm:text-xs md:text-sm font-sans tracking-[0.2em] text-amber-200 uppercase font-bold">
    {t?.datePrice || "Закрытый лист • Сбор группы • Старый Город • $45 / персона"}
  </span>
</div>

    </div>
  );
}