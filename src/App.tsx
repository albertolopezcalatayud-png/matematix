import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { HTML_LANG, useT } from '@/i18n';
import { useApp } from '@/stores/app';
import Home from '@/pages/Home';
import Language from '@/pages/Language';
import MapPage from '@/pages/MapPage';
import Lesson from '@/pages/Lesson';
import StartPoint from '@/pages/StartPoint';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import { TopBar } from '@/components/Layout';

function Privacy() {
  const { t } = useT();
  return (
    <div className="min-h-dvh"><TopBar title={t('privacy')} back="/" />
      <main className="max-w-xl mx-auto px-4"><p className="card">{t('privacy_text')}</p></main>
    </div>
  );
}

/** A new station starts from scratch (otherwise going from one station to another kept the old state). */
function LessonFresh() { const { id } = useParams(); return <Lesson key={id} />; }

/** Applies language, text size, colours and motion to the whole page. */
function Appearance() {
  const { lang, large, theme, motion } = useApp();
  useEffect(() => {
    const r = document.documentElement;
    r.lang = HTML_LANG[lang ?? 'es'];
    r.dataset.size = large ? 'large' : 'normal';
    if (theme === 'auto') delete r.dataset.theme; else r.dataset.theme = theme;
    r.dataset.motion = motion;
  }, [lang, large, theme, motion]);
  return null;
}

export default function App() {
  const lang = useApp((s) => s.lang);
  return (
    <HashRouter>
      <Appearance />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/idioma" element={<Language />} />
        <Route path="/mapa" element={lang ? <MapPage /> : <Navigate to="/idioma" />} />
        <Route path="/estacion/:id" element={lang ? <LessonFresh /> : <Navigate to="/idioma" />} />
        <Route path="/punto-de-partida" element={lang ? <StartPoint /> : <Navigate to="/idioma" />} />
        <Route path="/progreso" element={<Progress />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}
