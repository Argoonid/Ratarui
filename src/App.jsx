import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Paradox from './components/Paradox';
import Experience from './components/Experience';
import Menu from './components/Menu';
import Rules from './components/Rules';
import Booking from './components/Booking';
import LocationGuide from './components/LocationGuide';
import Footer from './components/Footer';
import PageDeck from './components/PageDeck';
import CinematicPreloader from './components/CinematicPreloader';
import { dict } from './data/dict';

const detectDefaultLang = () => {
  if (typeof window === 'undefined' || !navigator?.language) return 'en';
  const userLang = navigator.language.toLowerCase();
  if (userLang.startsWith('ru')) return 'ru';
  if (userLang.startsWith('it')) return 'it';
  return 'en';
};

export default function App() {
  const [lang, setLang] = useState('en');
  
  useEffect(() => {
    setLang(detectDefaultLang());

    // Перехват партнерского реферала из URL (?ref=hotel или ?r=hotel)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || urlParams.get('r');
      if (refParam) {
        const cleanRef = refParam.trim().toLowerCase().slice(0, 40);
        localStorage.setItem('ratarui_ref', cleanRef);
      }
    } catch {
      // Изоляция ошибок в приватном режиме браузеров
    }
  }, []);

  const t = dict[lang] || dict.en;

  const chapters = useMemo(() => [
    {
      id: 'hero',
      roman: 'I',
      title: lang === 'it' ? 'Apertura' : lang === 'en' ? 'Curtain' : 'Входной занавес',
      beamClass: '-top-20 right-10 w-96 h-[500px] bg-gradient-to-b from-amber-500/15 to-transparent rotate-12 blur-[110px]',
      component: <Hero t={t} lang={lang} />
    },
    {
      id: 'paradox',
      roman: 'II',
      title: lang === 'it' ? 'Il Paradosso' : lang === 'en' ? 'Paradox' : 'Парадокс локации',
      beamClass: '-bottom-10 -left-10 w-96 h-96 bg-amber-600/10 blur-[120px]',
      component: <Paradox t={t} lang={lang} />
    },
    {
      id: 'experience',
      roman: 'III',
      title: lang === 'it' ? 'La Serata' : lang === 'en' ? 'Timeline' : 'Анатомия вечера',
      beamClass: 'bottom-0 left-1/2 -translate-x-1/2 w-full h-80 bg-amber-700/10 blur-[130px]',
      component: <Experience t={t} />
    },
    {
      id: 'menu',
      roman: 'IV',
      title: lang === 'it' ? 'Menu' : lang === 'en' ? 'Menu' : 'Сет от Реми',
      beamClass: 'top-1/3 left-1/2 -translate-x-1/2 w-full h-96 bg-amber-500/10 blur-[140px]',
      component: <Menu t={t} lang={lang} />
    },
    {
      id: 'rules',
      roman: 'V',
      title: lang === 'it' ? 'Verdetto' : lang === 'en' ? 'Verdict' : 'Вердикт Эго',
      beamClass: '-top-10 -left-10 w-80 h-96 bg-blue-900/15 blur-[110px]',
      component: <Rules t={t} />
    },
    {
      id: 'booking',
      roman: 'VI',
      title: lang === 'it' ? 'Prenotazione' : lang === 'en' ? 'Booking' : 'Бронь зала',
      beamClass: 'top-10 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-amber-500/15 blur-[120px]',
      component: <Booking t={t} lang={lang} />
    },
    {
      id: 'location',
      roman: 'VII',
      title: lang === 'it' ? 'Posizione' : lang === 'en' ? 'Location' : 'Как нас найти',
      beamClass: 'bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 blur-[120px]',
      component: (
        <div className="w-full flex flex-col justify-between h-full">
          <LocationGuide t={t} />
          <Footer t={t} />
        </div>
      )
    }
  ], [lang, t]);

  return (
    <CinematicPreloader duration={8600}>
      <div className="w-screen h-[100dvh] overflow-hidden bg-[#060505] text-amber-50 font-serif antialiased relative selection:bg-amber-700 selection:text-white">
        <div className="film-grain" />
        <Header lang={lang} setLang={setLang} />

        <main className="w-full h-full">
          <PageDeck chapters={chapters} lang={lang} t={t} />
        </main>
      </div>
    </CinematicPreloader>
  );
}