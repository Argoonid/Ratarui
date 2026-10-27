import React, { useRef, useState, useMemo, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, Users, Check, Loader2 } from 'lucide-react';

const LUCKY_NUMBERS = [
  "081261", "143053", "254371", "316280", "408165",
  "521341", "630423", "712352", "804264", "913454",
  "172343", "263452", "381525", "472643", "563725"
];

const I18N = {
  ru: {
    passType: "CINEMA GASTRONOMY PASS",
    movie: "«РАТАТУЙ»",
    location: "ISTANBUL • OLD TOWN • SHARM EL SHEIKH",
    guestLabel: "ГОСТЬ",
    tableLabel: "СТОЛ",
    guestsSuffix: "ПЕРСОНЫ",
    sessionLabel: "СЕАНС 20:00",
    date: "СБОР ГРУППЫ",
    entryNotice: "ЛИСТ ОЖИДАНИЯ",
    pairingPrefix: "СЕТ:",
    controlTitle: "КОНТРОЛЬ",
    gusteauTop: "AUGUSTE",
    gusteauMid: "ПОДАНО",
    gusteauBot: "GUSTEAU",
    egoTop: "ANTOINE",
    egoMid: "ОДОБРЕНО",
    egoBot: "EGO",
    btnSave: "Сохранить билет (PNG)",
    btnSaving: "Создание билета...",
    btnSaved: "Билет в галерее",
    wine: "Винный сет (Франция)",
    halal: "Halal Кордиалы",
    notice: "Дата показа утверждается по заполнению зала (20 столов). Консьерж уведомит вас лично."
  },
  en: {
    passType: "CINEMA GASTRONOMY PASS",
    movie: "RATATOUILLE",
    location: "ISTANBUL • OLD TOWN • SHARM EL SHEIKH",
    guestLabel: "GUEST",
    tableLabel: "TABLE",
    guestsSuffix: "GUESTS",
    sessionLabel: "SESSION 20:00",
    date: "GROUP FORMING",
    entryNotice: "PRIVATE WAITLIST",
    pairingPrefix: "PAIRING:",
    controlTitle: "STUB",
    gusteauTop: "AUGUSTE",
    gusteauMid: "SERVED",
    gusteauBot: "GUSTEAU",
    egoTop: "ANTOINE",
    egoMid: "APPROVED",
    egoBot: "EGO",
    btnSave: "Save Ticket (PNG)",
    btnSaving: "Rendering...",
    btnSaved: "Saved to Gallery",
    wine: "French Wine Pairing",
    halal: "Halal Cordials",
    notice: "Event date confirmed once all 20 tables are reserved. You will be notified directly."
  }
};

const BASE_WIDTH = 880;
const BASE_HEIGHT = 370;

export default function VIPTicket({ bookingData, lang = 'ru', isCaptureMode = false }) {
  const containerRef = useRef(null);
  const ticketRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const t = I18N[lang] || I18N.ru;

  const ticketNumber = useMemo(() => {
    return LUCKY_NUMBERS[Math.floor(Math.random() * LUCKY_NUMBERS.length)];
  }, []);

  useEffect(() => {
    if (isCaptureMode || !containerRef.current) return;

    const calculateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth;
      const targetScale = Math.min(1, (availableWidth - 8) / BASE_WIDTH);
      setScale(Math.max(0.32, targetScale));
    };

    calculateScale();
    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isCaptureMode]);

  const handleDownload = async () => {
    if (!ticketRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 1,
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        style: { transform: 'none', margin: '0', position: 'static' },
        backgroundColor: '#0a0806'
      });

      const link = document.createElement('a');
      link.download = `Golden-Ticket-Table-${bookingData.table || 'VIP'}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const pairingText = bookingData.pairing?.includes('Винный') || bookingData.pairing?.includes('Wine') ? t.wine : t.halal;

  const renderTicketBody = () => (
    <div 
      ref={ticketRef}
      className="relative w-[880px] h-[370px] flex font-serif text-[#3b2a1a] rounded-[10px] overflow-hidden select-none"
      style={{
        background: 'linear-gradient(to right, #cf9d26 0%, #ffeaa7 18%, #b8860b 50%, #fbf2c0 82%, #a77708 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.95), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.6)'
      }}
    >
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)'
        }}
      />

      <div className="absolute inset-3 border-[1.5px] border-[#5a4222] rounded-md pointer-events-none opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]" />

      {/* Левая часть */}
      <div className="flex-1 p-8 flex flex-col justify-between relative border-r-[3px] border-dotted border-[#7c561b]">
        <div className="relative z-10 flex justify-between items-center text-xs tracking-[0.35em] font-sans uppercase font-black">
          <div className="flex items-center gap-2" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            <span>✦</span>
            <span>{t.passType}</span>
            <span>✦</span>
          </div>
          <div className="font-mono tracking-widest text-sm font-bold" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            № {ticketNumber}
          </div>
        </div>

        <div className="relative z-10 my-auto pr-6">
          <div className="text-[10px] font-sans tracking-[0.3em] uppercase font-bold mb-1" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            {t.location}
          </div>
          <h3 
            className="text-5xl lg:text-6xl font-black tracking-wider uppercase font-serif"
            style={{
              color: '#24180e',
              textShadow: '0 2px 2px rgba(255,255,255,0.6), 0 -1px 1px rgba(0,0,0,0.8)'
            }}
          >
            {t.movie}
          </h3>
          <div className="text-sm font-sans font-bold mt-3 tracking-wide" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            {t.guestLabel}: <span className="font-serif text-2xl ml-2 tracking-normal text-[#1a120b]">{bookingData.name || "Monsieur le Gourmet"}</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col font-sans text-xs font-bold tracking-wide" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
          <div className="uppercase">
            <span className="mr-2 text-[#4a3418]">{t.pairingPrefix}</span>
            <span className="text-[#1a120b]">{pairingText}</span>
          </div>
          <div className="text-[10px] mt-0.5 tracking-widest text-[#4a3418]">
            {t.date} • {t.entryNotice}
          </div>
        </div>

        {/* Восковые печати */}
        <div className="absolute right-[-10px] bottom-3 flex items-center -space-x-7 z-30 pointer-events-none">
          <div 
            className="w-26 h-26 flex items-center justify-center relative rotate-[-10deg]"
            style={{
              borderRadius: '45% 65% 55% 40% / 55% 45% 60% 50%',
              background: 'radial-gradient(circle at 35% 30%, #a81c1c 0%, #6e0c0c 60%, #3d0505 100%)',
              boxShadow: '0 12px 22px rgba(0,0,0,0.8), inset 0 3px 5px rgba(255,200,200,0.4)',
              border: '1px solid rgba(255,100,100,0.2)'
            }}
          >
            <div 
              className="w-18 h-18 rounded-full flex flex-col items-center justify-center p-1.5 border border-[#4a0505]"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #7a1111 0%, #4a0606 80%, #290202 100%)',
                boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9)'
              }}
            >
              <span className="text-[6px] font-sans font-black tracking-widest text-red-300 uppercase leading-none opacity-80">{t.gusteauTop}</span>
              <span className="text-xs font-serif font-black tracking-widest text-[#facc15] uppercase my-0.5">{t.gusteauMid}</span>
              <span className="text-[6px] font-sans font-black tracking-widest text-red-300 uppercase leading-none opacity-80">{t.gusteauBot}</span>
            </div>
          </div>

          <div 
            className="w-26 h-26 flex items-center justify-center relative rotate-[14deg] mt-8"
            style={{
              borderRadius: '60% 40% 50% 45% / 50% 60% 40% 55%',
              background: 'radial-gradient(circle at 35% 30%, #1a2a40 0%, #0d1624 60%, #050a12 100%)',
              boxShadow: '0 12px 22px rgba(0,0,0,0.8), inset 0 3px 5px rgba(180,210,255,0.3)',
              border: '1px solid rgba(100,150,255,0.1)'
            }}
          >
            <div 
              className="w-18 h-18 rounded-full flex flex-col items-center justify-center p-1.5 border border-[#080d17]"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #111e30 0%, #08101a 80%, #03060a 100%)',
                boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.9)'
              }}
            >
              <span className="text-[6px] font-sans font-black tracking-widest text-blue-300/80 uppercase leading-none">{t.egoTop}</span>
              <span className="text-[10px] font-serif font-black tracking-widest text-[#facc15] uppercase my-1">{t.egoMid}</span>
              <span className="text-[6px] font-sans font-black tracking-widest text-blue-300/80 uppercase leading-none">{t.egoBot}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-[244px] -top-5 w-10 h-10 rounded-full bg-[#100c0a] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] z-20" />
      <div className="absolute right-[244px] -bottom-5 w-10 h-10 rounded-full bg-[#100c0a] shadow-[inset_0_-2px_8px_rgba(0,0,0,0.9)] z-20" />

      {/* Корешок */}
      <div className="w-[256px] p-7 flex flex-col justify-between relative">
        <div className="text-center pb-3 border-b-2 border-dotted border-[#7c561b]">
          <span className="text-xs font-sans uppercase tracking-[0.35em] font-black block mb-1" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            {t.controlTitle}
          </span>
          <span className="text-lg font-serif font-black uppercase" style={{ color: '#24180e', textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            {t.movie}
          </span>
        </div>

        <div className="my-auto space-y-4 text-center font-sans">
          <div>
            <span className="text-[10px] uppercase tracking-widest block font-bold" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
              {t.tableLabel}
            </span>
            <span className="text-5xl font-black leading-none mt-1 block" style={{ color: '#24180e' }}>
              #{bookingData.table || "8"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest block font-bold mb-0.5" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
              {t.guestLabel}
            </span>
            <span className="text-xs font-black uppercase" style={{ color: '#24180e' }}>
              {bookingData.guests || 2} {t.guestsSuffix}
            </span>
          </div>
        </div>

        <div className="text-center pt-3 border-t-2 border-dotted border-[#7c561b]">
          <span className="text-xs font-mono font-black tracking-widest block mb-1" style={{ color: '#24180e' }}>
            № {ticketNumber}
          </span>
          <span className="text-[9px] font-sans font-bold tracking-widest uppercase block" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.6)' }}>
            {t.date} • {t.sessionLabel}
          </span>
        </div>
      </div>
    </div>
  );

  // Если вызвано для скрытого скриншота — отдаем только тело бланка
  if (isCaptureMode) {
    return renderTicketBody();
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto select-none">
      <div ref={containerRef} className="w-full flex justify-center items-center py-2 overflow-hidden">
        <div style={{ width: `${BASE_WIDTH * scale}px`, height: `${BASE_HEIGHT * scale}px`, position: 'relative', flexShrink: 0 }}>
          <div style={{ width: `${BASE_WIDTH}px`, height: `${BASE_HEIGHT}px`, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
            {renderTicketBody()}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col gap-2 font-sans text-xs mt-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="cursor-pointer py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 text-[#1a120b]"
          style={{ background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)' }}
        >
          {isExporting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>{t.btnSaving}</span></>
          ) : downloadSuccess ? (
            <><Check className="w-4 h-4" /><span>{t.btnSaved}</span></>
          ) : (
            <><Download className="w-4 h-4" /><span>{t.btnSave}</span></>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-amber-500/80 bg-amber-950/20 border border-amber-900/30 rounded-lg p-2.5 text-center">
          <Users className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{t.notice}</span>
        </div>
      </div>
    </div>
  );
}