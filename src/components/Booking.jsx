import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wine, Sparkles, Users } from 'lucide-react';
import { toPng } from 'html-to-image';
import VIPTicket from './VIPTicket';

const OCCUPIED_TABLES = [3, 7, 10, 14]; 
const TOTAL_TABLES = 20;
const TICKET_PRICE = 45;

export default function Booking({ t, lang = 'ru' }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guests, setGuests] = useState(2);
  const [contactMethod, setContactMethod] = useState('telegram');
  const [audioVote, setAudioVote] = useState(lang);
  const [pairing, setPairing] = useState('wine');

  const [formData, setFormData] = useState({ name: '', phone: '', hotel: '' });
  const [status, setStatus] = useState('idle');

  const captureRef = useRef(null);
  const availableCount = TOTAL_TABLES - OCCUPIED_TABLES.length;

  const tables = Array.from({ length: TOTAL_TABLES }, (_, i) => ({
    id: i + 1,
    isOccupied: OCCUPIED_TABLES.includes(i + 1)
  }));

  const handleTableSelect = (e, id) => {
    e.stopPropagation();
    setSelectedTable(id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Локализованная надпись счетчика оставшихся мест
  const waitlistBadgeText = t?.waitlistBadge
    ? t.waitlistBadge.replace('{left}', availableCount).replace('{total}', TOTAL_TABLES)
    : `Формирование группы: осталось ${availableCount} из ${TOTAL_TABLES} столов`;

  const pairingLabelText = pairing === 'wine' 
    ? (t?.wine || 'Винный сет (Франция)') 
    : (t?.halal || 'Halal Кордиалы');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    setStatus('loading');

    // 1. Отрисовываем снимок билета в скрытом буфере для Telegram
    let photoBase64 = null;
    try {
      if (captureRef.current) {
        photoBase64 = await toPng(captureRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          quality: 0.95,
          width: 880,
          height: 370
        });
      }
    } catch (err) {
      console.warn('Не удалось отрендерить билет:', err);
    }

    const payload = {
      table: selectedTable,
      guests,
      totalPrice: guests * TICKET_PRICE,
      pairing: pairingLabelText,
      audioVote,
      contactMethod,
      ...formData,
      photoBase64,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) console.error('Ошибка сервера бронирования:', data);
    } catch (err) {
      console.error('Сетевой сбой при отправке:', err);
    } finally {
      setStatus('success');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center py-1 select-none">
      
      {/* СКРЫТЫЙ БУФЕР ДЛЯ РЕНДЕРА КАРТИНКИ В TELEGRAM */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: 0, 
          width: '880px', 
          height: '370px', 
          overflow: 'hidden', 
          pointerEvents: 'none',
          zIndex: -50 
        }}
      >
        <div ref={captureRef} style={{ width: '880px', height: '370px' }}>
          <VIPTicket 
            bookingData={{
              table: selectedTable || 1,
              name: formData.name || (t?.guestLabel || "Гость"),
              guests: guests,
              pairing: pairingLabelText
            }}
            lang={lang}
            isCaptureMode={true}
          />
        </div>
      </div>

      {/* Шапка блока */}
      <div className="text-center mb-3">
        <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500 font-sans font-bold">
          {t?.statusBadge || "Лист ожидания сеанса"}
        </span>
        <h3 className="text-xl sm:text-2xl md:text-3xl text-amber-100 font-bold mt-0.5">
          {t?.bookTitle || "Бронь кинозала"}
        </h3>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-800/40 rounded-full text-[11px] font-sans text-amber-300 mt-1.5">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{waitlistBadgeText}</span>
        </div>
      </div>

      {/* Схема зала */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0807] border border-amber-900/40 rounded-2xl p-4 sm:p-5 shadow-xl"
      >
        <div className="flex justify-between items-center mb-2.5 text-[10px] font-sans text-zinc-400">
          <span className="uppercase tracking-wider text-amber-500 font-bold">
            {t?.planTitle || "План зала ресторана"}
          </span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zinc-700" /> {t?.freeStatus || "Свободен"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-900" /> {t?.bookedStatus || "В листе"}
            </span>
          </div>
        </div>

        <div className="w-full py-1 bg-gradient-to-b from-amber-500/20 to-transparent border-t-2 border-amber-500/60 text-center rounded-t mb-3">
          <span className="text-[8px] tracking-[0.4em] uppercase text-amber-300 font-sans font-bold">
            {t?.screenLabel || "4K PROJECTION SCREEN"}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {tables.map(table => {
            const isSelected = selectedTable === table.id;
            return (
              <button
                key={table.id}
                type="button"
                disabled={table.isOccupied}
                onClick={(e) => handleTableSelect(e, table.id)}
                className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center font-sans transition-all border ${
                  table.isOccupied 
                    ? 'bg-red-950/20 border-red-900/30 text-red-800 cursor-not-allowed opacity-40' 
                    : isSelected 
                      ? 'cursor-pointer bg-amber-500 border-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' 
                      : 'cursor-pointer bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-amber-400 hover:bg-amber-950/30'
                }`}
              >
                <span className="text-[8px] uppercase tracking-wider opacity-60">
                  {t?.tablePrefix || "Стол"}
                </span>
                <span className="text-xs font-bold">{table.id}</span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-[10px] font-sans text-zinc-400 mt-3">
          {t?.planNotice || "Выберите стол для фиксации в группе. Дата показа утверждается по заполнению зала."}
        </p>
      </div>

      {/* Модальное окно */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className={`relative w-full ${
                status === 'success' ? 'max-w-4xl lg:max-w-5xl' : 'max-w-md'
              } bg-[#100c0a] border border-amber-600/40 rounded-3xl p-4 sm:p-6 shadow-2xl max-h-[94vh] overflow-y-auto overflow-x-hidden transition-all duration-300`}
            >
              <button 
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (status === 'success') setStatus('idle');
                }}
                className="cursor-pointer absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white z-30"
              >
                <X className="w-4 h-4" />
              </button>

              {status === 'success' ? (
                <VIPTicket 
                  bookingData={{
                    table: selectedTable,
                    name: formData.name,
                    guests: guests,
                    pairing: pairingLabelText
                  }}
                  lang={lang}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">
                      {t?.modalSubtitle || "Включение в закрытый лист"}
                    </span>
                    <h4 className="text-lg font-bold text-amber-100">
                      {t?.tablePrefix || "Столик"} #{selectedTable}
                    </h4>
                  </div>

                  <div className="p-3 bg-zinc-950/70 border border-amber-900/30 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-zinc-500 block text-[9px]">
                        {t?.depositLabel || "Депозит сета ($45/персона):"}
                      </span>
                      <span className="text-base font-bold text-amber-400">${guests * TICKET_PRICE}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`cursor-pointer w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                            guests === num ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 uppercase tracking-wider text-[9px]">
                      {t?.pairingLabel || "Пейринг напитков:"}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPairing('wine')}
                        className={`cursor-pointer py-2 px-2.5 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                          pairing === 'wine' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <Wine className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{t?.wine || "Винный сет (FR)"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPairing('halal')}
                        className={`cursor-pointer py-2 px-2.5 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                          pairing === 'halal' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{t?.halal || "Halal Кордиалы"}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 uppercase tracking-wider text-[9px]">
                      {t?.voiceLabel || "Голос за дубляж фильма:"}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[{ id: 'en', label: 'English' }, { id: 'ru', label: 'Русский' }, { id: 'it', label: 'Italiano' }].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAudioVote(item.id)}
                          className={`cursor-pointer py-1.5 rounded-lg border text-xs transition-colors ${
                            audioVote === item.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 uppercase tracking-wider text-[9px]">
                      {t?.contactLabel || "Способ связи консьержа:"}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'telegram', label: 'Telegram' }, 
                        { id: 'whatsapp', label: 'WhatsApp' }, 
                        { id: 'phone', label: t?.contactCall || (lang === 'it' ? 'Chiamata' : lang === 'en' ? 'Call' : 'Звонок') }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setContactMethod(item.id)}
                          className={`cursor-pointer py-1.5 rounded-lg border text-xs transition-colors ${
                            contactMethod === item.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t?.namePlaceholder || "Ваше имя и фамилия"}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-amber-100 outline-none focus:border-amber-500"
                  />
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={contactMethod === 'telegram' ? (t?.phonePlaceholder || "@username или номер") : "+20 100 000 0000"}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-amber-100 outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    name="hotel"
                    value={formData.hotel}
                    onChange={handleInputChange}
                    placeholder={t?.hotelPlaceholder || "Отель (для организации трансфера)"}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-amber-100 outline-none focus:border-amber-500"
                  />

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="cursor-pointer w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg transition-transform active:scale-98 disabled:opacity-50"
                  >
                    {status === 'loading' 
                      ? (t?.btnLoading || 'Генерация билета...') 
                      : (t?.btnSubmit || 'Забронировать и получить билет')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}