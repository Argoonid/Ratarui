import React from 'react';

const steps = [
  {
    num: "01",
    time: "19:00 — 19:30",
    title: "VIP-Трансфер из отеля",
    desc: "Кондиционированный автомобиль забирает вас от лобби (Набк, Наама Бей, Хадаба)."
  },
  {
    num: "02",
    time: "19:40 — 20:00",
    title: "Красная дорожка & Welcome",
    desc: "Бокал вина или моктейль, сырное плато и парижский багет в закрытом зале ISTANBUL."
  },
  {
    num: "03",
    time: "20:00 — 21:55",
    title: "Синхронный 4K-показ",
    desc: "6 авторских курсов от первой мадленки до Конфи Бьялди секунда в секунду с фильмом."
  },
  {
    num: "04",
    time: "22:00 — 22:30",
    title: "Дижестив и возврат",
    desc: "Итальянский эспрессо, финальные титры и трансфер обратно в номер."
  }
];

export default function Experience() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-center py-1">
      {/* Заголовок */}
      <div className="text-center mb-3 sm:mb-6">
        <span className="text-[9px] sm:text-xs uppercase tracking-[0.35em] text-amber-500 font-sans font-bold">
          All-Inclusive Protocol
        </span>
        <h3 className="text-xl sm:text-3xl md:text-4xl text-amber-100 font-bold mt-0.5">
          Анатомия вечера
        </h3>
        <p className="text-zinc-400 font-sans text-xs sm:text-sm max-w-md mx-auto mt-0.5">
          Каждый шаг выверен с точностью часового механизма
        </p>
      </div>

      {/* Мобильная версия: вертикальная нить времени (заполняет всю высоту без дыр) */}
      <div className="block sm:hidden relative px-2 space-y-2">
        {/* Вертикальная направляющая струна */}
        <div className="absolute left-6 top-3 bottom-3 w-px bg-gradient-to-b from-amber-500/60 via-amber-800/40 to-amber-950/20" />

        {steps.map((step) => (
          <div 
            key={step.num}
            className="relative flex items-start gap-3.5 pl-1"
          >
            {/* Маркер с номером этапа */}
            <div className="w-8 h-8 rounded-full bg-[#140f0c] border border-amber-500/60 flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span className="text-[11px] font-bold font-sans text-amber-400">{step.num}</span>
            </div>

            {/* Карточка шага */}
            <div className="flex-1 bg-[#0e0c0b]/90 border border-amber-900/35 rounded-xl p-2.5">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="text-xs font-bold text-amber-100">{step.title}</h4>
                <span className="text-[9px] font-sans text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-900/40">
                  {step.time}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Десктопная версия: 4 колонки в ряд */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {steps.map((step, idx) => (
          <div 
            key={step.num}
            className="bg-[#0e0c0b]/90 border border-amber-900/40 hover:border-amber-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl md:text-3xl font-bold font-sans text-amber-600/30">{step.num}</span>
                <span className="text-[10px] md:text-xs font-sans text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-800/50">
                  {step.time}
                </span>
              </div>
              <h4 className="text-sm md:text-base font-bold text-amber-100 mb-1.5">{step.title}</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">{step.desc}</p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-zinc-900 flex justify-between text-[10px] text-zinc-500 font-sans">
              <span>Этап {idx + 1}</span>
              <span className="text-amber-600">◆</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}