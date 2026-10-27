import React from 'react';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';

export default function LocationGuide() {
  const mapUrl = "https://share.google/3gyF8mOZPZUNM2ivQ";

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col justify-center items-center py-2 px-3 select-none">
      
      {/* Заголовок */}
      <div className="text-center mb-3">
        <span className="text-[9px] uppercase tracking-[0.35em] text-amber-500 font-sans font-bold">
          Координаты вечера
        </span>
        <h3 className="text-xl sm:text-3xl text-amber-100 font-bold font-serif mt-0.5">
          Ресторан ISTANBUL • Old Town
        </h3>
      </div>

      {/* Интерактивная карточка локации */}
      <div className="w-full max-w-2xl bg-[#0e0b0a] border border-amber-900/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/25">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200 font-sans">Старый Рынок (Old Market)</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Шарм-эль-Шейх, Южный Синай, Египет</p>
            </div>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Открыть Google Maps</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Дополнительные детали прибытия */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 font-sans text-xs">
          <div className="flex items-start gap-2 text-zinc-300">
            <Compass className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Ориентир — центральная площадь Старого Города у Мечети Аль-Сахаба.</span>
          </div>
          <div className="flex items-start gap-2 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <span>Для гостей с трансфером: подача авто ко входу в лобби отеля за 40 мин до начала.</span>
          </div>
        </div>

        {/* БЛОК СОЦИАЛЬНЫХ СЕТЕЙ */}
        <div className="mt-4 pt-3 border-t border-amber-900/25 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[10px] font-sans uppercase tracking-widest text-zinc-500">
            Следите за датами и анонсами:
          </span>

          <div className="flex items-center gap-2">
            {/* Instagram (нативный вектор) */}
            <a
              href="https://www.instagram.com/sharminoevents/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 text-[11px] font-sans transition-colors group"
            >
              <svg className="w-3.5 h-3.5 stroke-pink-500 group-hover:stroke-amber-300 fill-none stroke-2 transition-colors" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* TikTok (нативный вектор) */}
            <a
              href="https://www.tiktok.com/@sharminoevents"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 text-[11px] font-sans transition-colors group"
            >
              <svg className="w-3.5 h-3.5 fill-cyan-400 group-hover:fill-amber-300 transition-colors" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49V11.2a8.27 8.27 0 0 0 4.88 1.6V9.35a4.83 4.83 0 0 1-.89-.04 4.85 4.85 0 0 1-.22-2.62z"/>
              </svg>
              <span>TikTok</span>
            </a>

            {/* Facebook (нативный вектор) */}
            <a
              href="https://www.facebook.com/groups/1151879983982807"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-300 text-[11px] font-sans transition-colors group"
            >
              <svg className="w-3.5 h-3.5 fill-blue-500 group-hover:fill-amber-300 transition-colors" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}