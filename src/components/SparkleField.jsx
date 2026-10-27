import React, { useMemo } from 'react';

// Детерминированный LCG-рандомайзер на основе сида главы
function createPrng(seedStr = 'default') {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  return function next() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

export default function SparkleField({ seed = 'act-1' }) {
  const stars = useMemo(() => {
    const rng = createPrng(seed);
    const count = 16 + Math.floor(rng() * 8); // от 16 до 23 звёзд на слайд
    const symbols = ['✦', '✧', '⋆', '•'];

    return Array.from({ length: count }, (_, i) => {
      const top = Math.floor(rng() * 88 + 5);
      const left = Math.floor(rng() * 90 + 5);
      const sizeIndex = Math.floor(rng() * 3);
      const symbol = symbols[Math.floor(rng() * symbols.length)];
      const duration = (2.0 + rng() * 2.5).toFixed(2);
      const delay = (rng() * 2.2).toFixed(2);
      const baseOpacity = (0.25 + rng() * 0.45).toFixed(2);

      return {
        id: `${seed}-${i}`,
        top: `${top}%`,
        left: `${left}%`,
        fontSize: sizeIndex === 0 ? '8px' : sizeIndex === 1 ? '11px' : '14px',
        symbol,
        duration: `${duration}s`,
        delay: `${delay}s`,
        baseOpacity
      };
    });
  }, [seed]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute text-amber-300 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.fontSize,
            animation: `twinkleCustom ${star.duration} ease-in-out infinite alternate`,
            animationDelay: star.delay,
            filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.7))'
          }}
        >
          {star.symbol}
        </span>
      ))}
      <style>{`
        @keyframes twinkleCustom {
          0% { opacity: 0.1; transform: scale(0.65) rotate(0deg); }
          50% { opacity: 0.95; transform: scale(1.15) rotate(12deg); }
          100% { opacity: 0.2; transform: scale(0.8) rotate(-8deg); }
        }
      `}</style>
    </div>
  );
}