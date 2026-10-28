import React from 'react';
import { Volume2, Clock, ShieldCheck } from 'lucide-react';

export default function Rules({ t }) {
  const rulesList = [
    {
      id: 'voice',
      icon: Volume2,
      label: t?.ruleVoiceLabel || "Голос сеанса:",
      desc: t?.ruleVoiceDesc || "Базовый язык — английский. Дубляж утверждается по большинству мест на показе."
    },
    {
      id: 'timing',
      icon: Clock,
      label: t?.ruleTimingLabel || "Секундная подача:",
      desc: t?.ruleTimingDesc || "Блюдо появляется перед вами ровно в момент его триумфа на экране. Опоздание ломает драматургию."
    },
    {
      id: 'allergy',
      icon: ShieldCheck,
      label: t?.ruleAllergyLabel || "Аллергии:",
      desc: t?.ruleAllergyDesc || "Сет монументален, но адаптируется при уведомлении координатора за 48 часов до сеанса."
    }
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center py-4 px-3 select-none">
      
      {/* Изображение Антуана Эго */}
      <div className="w-28 sm:w-36 mb-1 pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
        <img 
          src={`${import.meta.env.BASE_URL}ego.png`} 
          alt="Antoine Ego" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Заголовки */}
      <div className="text-center mb-4">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-cyan-500 font-sans font-bold">
          {t?.rulesBadge || "БЕСКОМПРОМИССНЫЕ ПРАВИЛА"}
        </span>
        <h3 className="text-xl sm:text-3xl text-amber-100 font-bold font-serif mt-0.5">
          {t?.rulesTitle || "Вердикт Антуана Эго"}
        </h3>
      </div>

      {/* Главная цитата Эго */}
      <div className="w-full bg-[#0a0807] border-l-2 border-cyan-600/70 bg-gradient-to-r from-cyan-950/20 to-transparent p-4 sm:p-5 rounded-r-2xl mb-4 relative shadow-2xl">
        <span className="absolute top-2 right-4 text-3xl font-serif text-cyan-600/30 select-none">
          ”
        </span>
        <p className="text-xs sm:text-sm text-cyan-100/90 font-serif italic leading-relaxed pr-6">
          {t?.rulesQuote || "«Шесть подач высокой кухни живут в строгой симфонии с экраном. Этот вечер подчинен безупречному таймингу, а не курортной небрежности.»"}
        </p>
      </div>

      {/* 3 строгих правила */}
      <div className="w-full space-y-2 font-sans text-xs">
        {rulesList.map(rule => {
          const Icon = rule.icon;
          return (
            <div 
              key={rule.id}
              className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-900 flex items-start gap-3 hover:border-zinc-800 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 leading-relaxed">
                <span className="font-bold text-amber-300 mr-2">{rule.label}</span>
                <span className="text-zinc-300">{rule.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}