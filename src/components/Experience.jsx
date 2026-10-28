import React from 'react';

export default function Experience({ t }) {
  const steps = [
    {
      id: "01",
      time: t?.step1Time || "19:00 — 19:30",
      title: t?.step1Title || "VIP-Трансфер из отеля",
      desc: t?.step1Desc || "Кондиционированный автомобиль забирает вас от лобби (Набк, Наама Бей, Хадаба)."
    },
    {
      id: "02",
      time: t?.step2Time || "19:40 — 20:00",
      title: t?.step2Title || "Красная дорожка & Welcome",
      desc: t?.step2Desc || "Бокал вина или моктейль, сырное плато и парижский багет в закрытом зале ISTANBUL."
    },
    {
      id: "03",
      time: t?.step3Time || "20:00 — 21:55",
      title: t?.step3Title || "Синхронный 4K-показ",
      desc: t?.step3Desc || "6 авторских курсов от первой мадленки до Конфи Бьялди секунда в секунду с фильмом."
    },
    {
      id: "04",
      time: t?.step4Time || "22:00 — 22:30",
      title: t?.step4Title || "Дижестив и возврат",
      desc: t?.step4Desc || "Итальянский эспрессо, финальные титры и трансфер обратно в номер."
    }
  ];

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto h-full max-h-[88dvh] flex flex-col justify-center py-2 sm:py-6 pl-3 pr-8 sm:px-6 select-none overflow-y-auto no-scrollbar">
      
      {/* Шапка секции */}
      <div className="text-center mb-3 sm:mb-8 shrink-0">
        <span className="text-[9px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-amber-500 font-sans font-bold block">
          {t?.expProtocol || "ALL-INCLUSIVE PROTOCOL"}
        </span>
        <h3 className="text-xl sm:text-3xl md:text-4xl text-amber-100 font-bold mt-0.5 sm:mt-1 mb-1 font-serif leading-tight">
          {t?.expTitle || "Анатомия вечера"}
        </h3>
        <p className="text-[11px] sm:text-sm text-zinc-400 font-sans max-w-xl mx-auto leading-tight sm:leading-normal">
          {t?.expDesc || "Каждый шаг выверен с точностью часового механизма"}
        </p>
      </div>
      
      {/* Сетка: 2x2 на мобилках, 4 в ряд на десктопе */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 shrink-0">
        {steps.map(step => (
          <div 
            key={step.id} 
            className="bg-[#0b0807]/90 border border-amber-900/30 p-2.5 sm:p-5 rounded-xl sm:rounded-2xl relative overflow-hidden group hover:border-amber-600/50 transition-colors shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-1.5 sm:mb-4 gap-1">
                <span className="text-base sm:text-2xl font-serif font-black text-amber-900/40 group-hover:text-amber-500/25 transition-colors">
                  {step.id}
                </span>
                <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] sm:text-[10px] font-bold rounded sm:rounded-lg font-mono shrink-0 whitespace-nowrap">
                  {step.time}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-200 mb-1 sm:mb-2 font-serif leading-snug line-clamp-1 sm:line-clamp-none">
                {step.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-zinc-400 leading-snug sm:leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                {step.desc}
              </p>
            </div>

            <div className="hidden sm:block absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-amber-500/40" />
          </div>
        ))}
      </div>

    </div>
  );
}