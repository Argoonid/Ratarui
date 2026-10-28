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
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto py-4 sm:py-8 select-none">
      <div className="text-center mb-6 sm:mb-10">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-amber-500 font-sans font-bold block">
          {t?.expProtocol || "ALL-INCLUSIVE PROTOCOL"}
        </span>
        <h3 className="text-2xl sm:text-4xl text-amber-100 font-bold mt-1 mb-2 font-serif">
          {t?.expTitle || "Анатомия вечера"}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl mx-auto">
          {t?.expDesc || "Каждый шаг выверен с точностью часового механизма"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {steps.map(step => (
          <div 
            key={step.id} 
            className="bg-[#0b0807]/90 border border-amber-900/30 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-600/50 transition-colors shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif font-black text-amber-900/40 group-hover:text-amber-500/25 transition-colors">
                {step.id}
              </span>
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg font-mono">
                {step.time}
              </span>
            </div>
            <h4 className="text-sm font-bold text-amber-200 mb-2 font-serif">
              {step.title}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {step.desc}
            </p>
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-amber-500/40" />
          </div>
        ))}
      </div>
    </div>
  );
}