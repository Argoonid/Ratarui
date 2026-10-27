import React from 'react';

export default function Paradox({ t }) {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto text-center border-b border-amber-900/30 relative">
      <div className="inline-block mb-3 text-xs uppercase tracking-[0.3em] text-amber-600 font-sans">
        Location & Atmosphere
      </div>
      <h3 className="text-3xl md:text-4xl text-amber-500 mb-6 font-bold leading-tight">
        {t.paradoxTitle}
      </h3>
      <p className="text-zinc-400 leading-relaxed font-sans text-base md:text-lg max-w-2xl mx-auto">
        {t.paradoxText}
      </p>
      
      {/* Тонкий акцентный разделитель */}
      <div className="flex items-center justify-center gap-3 mt-10">
        <div className="h-px w-12 bg-amber-900/50"></div>
        <span className="text-amber-700 text-xs">◆</span>
        <div className="h-px w-12 bg-amber-900/50"></div>
      </div>
    </section>
  );
}