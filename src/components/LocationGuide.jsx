import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function LocationGuide({ lang }) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-center py-2 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
        <Compass className="w-6 h-6 animate-spin-slow" />
      </div>

      <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500 font-sans font-bold block mb-1">
        Destination • Old Town
      </span>
      <h3 className="text-2xl sm:text-3xl md:text-4xl text-amber-100 font-bold mb-3">
        Как добраться в ISTANBUL
      </h3>
      
      {/* Слот под будущий контент от тебя */}
      <div className="bg-[#0e0c0b]/90 border border-amber-900/35 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-amber-400 mb-2 font-sans text-xs">
          <MapPin className="w-4 h-4" />
          <span>Old Market • Sharm El Sheikh</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
          Пространство готово под твои координаты, ориентиры возле мечети или скалы и детали встречи гостей с трансфера.
        </p>
      </div>
    </div>
  );
}