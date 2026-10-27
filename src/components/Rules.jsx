import React from 'react';
import { Volume2, Clock, ShieldAlert, Quote } from 'lucide-react';

export default function Rules() {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col justify-center items-center py-1 px-3 select-none">
      
      {/* СИЛУЭТ АНТУАНА ЭГО В ХОЛОДНОМ ЛУННОМ СОФИТЕ */}
      <div className="relative -mb-4 sm:-mb-6 flex flex-col items-center z-10">
        
        {/* Холодный кобальтовый свет за спиной критика */}
        <div className="absolute top-2 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-gradient-to-b from-blue-900/30 via-indigo-950/15 to-transparent rounded-full blur-3xl pointer-events-none transform -translate-y-4" />
        
        {/* Фигура критика: торс плавно растворяется вниз */}
        <div 
          className="relative w-36 sm:w-48 md:w-56 transition-transform duration-700 hover:scale-105"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 98%)'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}ego.png`} 
            alt="Antoine Ego" 
            className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
          />
        </div>

        {/* Растворение среза в трюфельный фон */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#060505] to-transparent pointer-events-none" />
      </div>

      {/* ШАПКА РАЗДЕЛА */}
      <div className="relative z-20 text-center mb-2 sm:mb-3">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-blue-400/90 font-sans font-bold block mb-0.5">
          Бескомпромиссные правила
        </span>
        <h3 className="text-xl sm:text-3xl md:text-4xl text-amber-100 font-bold font-serif leading-tight">
          Вердикт Антуана Эго
        </h3>
      </div>

      {/* АКЦЕНТНАЯ ЦИТАТА КРИТИКА */}
      <div className="relative z-20 bg-gradient-to-r from-blue-950/40 via-zinc-950/80 to-[#0e0c0b] border-l-2 border-blue-400 rounded-r-2xl p-3 sm:p-4 mb-3 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
        <Quote className="w-4 h-4 text-blue-400/40 absolute top-2 right-3" />
        <p className="text-xs sm:text-sm text-zinc-200 font-serif italic leading-relaxed pr-6">
          «Шесть подач высокой кухни живут в строгой симфонии с экраном. Этот вечер подчинен безупречному таймингу, а не курортной небрежности.»
        </p>
      </div>

      {/* 3 ПРАВИЛА ВЕРДИКТА */}
      <div className="relative z-20 grid grid-cols-1 gap-2 max-w-2xl mx-auto w-full font-sans">
        <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 shadow-md">
          <Volume2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-snug">
            <strong className="text-amber-200 mr-1.5 font-semibold">Голос сеанса:</strong>
            Базовый язык — английский. Дубляж утверждается по большинству мест на показе.
          </div>
        </div>

        <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 shadow-md">
          <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-snug">
            <strong className="text-amber-200 mr-1.5 font-semibold">Секундная подача:</strong>
            Блюдо появляется перед вами ровно в момент его триумфа на экране. Опоздание ломает драматургию.
          </div>
        </div>

        <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 shadow-md">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-snug">
            <strong className="text-amber-200 mr-1.5 font-semibold">Аллергии:</strong>
            Сет монументален, но адаптируется при уведомлении координатора за 48 часов до сеанса.
          </div>
        </div>
      </div>

    </div>
  );
}