import React from 'react';
import { motion } from 'framer-motion';

export default function Header({ lang, setLang }) {
  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 md:px-12 py-5 bg-gradient-to-b from-[#080707] via-[#080707]/90 to-transparent z-50 backdrop-blur-sm border-b border-amber-900/10">
      <a 
        href="#hero" 
        className="cursor-pointer text-base md:text-lg font-bold tracking-[0.25em] text-amber-400 uppercase hover:text-amber-300 transition-colors"
      >
        Sharmino & Istanbul
      </a>
      
      {/* Переключатель языков с курсором и анимацией */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-950/80 border border-amber-900/30 shadow-inner">
        {['en', 'ru', 'it'].map((l) => {
          const isActive = lang === l;
          return (
            <button 
              key={l} 
              type="button"
              onClick={() => setLang(l)}
              className={`cursor-pointer relative px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 ${
                isActive 
                  ? 'text-black font-bold' 
                  : 'text-zinc-500 hover:text-amber-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLangBubble"
                  className="absolute inset-0 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">{l}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}