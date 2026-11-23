import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { HTML_LANG, useT } from '@/i18n';
import { useApp } from '@/stores/app';
import Home from '@/pages/Home';
import Language from '@/pages/Language';
import MapPage from '@/pages/MapPage';
import World from '@/pages/World';
import Lesson from '@/pages/Lesson';
import StartPoint from '@/pages/StartPoint';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import Who from '@/pages/Who';
import { TopBar } from '@/components/Layout';

// The adults' area is loaded only when an adult opens it (the children's app stays small).
const Hub = lazy(() => import('@/pages/adults/Hub'));
const Pupils = lazy(() => import('@/pages/adults/Pupils'));
const Sheets = lazy(() => import('@/pages/adults/Sheets'));
const Board = lazy(() => import('@/pages/adults/Board'));
const Certificate = lazy(() => import('@/pages/adults/Certificate'));
const Guide = lazy(() => import('@/pages/adults/Guide'));
const Family = lazy(() => import('@/pages/adults/Family'));

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
      <Suspense fallback={<p className="p-6 text-center">…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/idioma" element={<Language />} />
        <Route path="/mapa" element={lang ? <World /> : <Navigate to="/idioma" />} />
        <Route path="/estaciones" element={lang ? <MapPage /> : <Navigate to="/idioma" />} />
        <Route path="/estacion/:id" element={lang ? <LessonFresh /> : <Navigate to="/idioma" />} />
        <Route path="/punto-de-partida" element={lang ? <StartPoint /> : <Navigate to="/idioma" />} />
        <Route path="/progreso" element={<Progress />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/quien" element={lang ? <Who /> : <Navigate to="/idioma" />} />
        <Route path="/adultos" element={lang ? <Hub /> : <Navigate to="/idioma" />} />
        <Route path="/adultos/alumnos" element={lang ? <Pupils /> : <Navigate to="/idioma" />} />
        <Route path="/adultos/fichas" element={lang ? <Sheets /> : <Navigate to="/idioma" />} />
        <Route path="/adultos/pizarra" element={lang ? <Board /> : <Navigate to="/idioma" />} />
        <Route path="/adultos/certificado" element={lang ? <Certificate /> : <Navigate to="/idioma" />} />
        <Route path="/adultos/guia" element={lang ? <Guide /> : <Navigate to="/idioma" />} />
        <Route path="/adultos/casa" element={lang ? <Family /> : <Navigate to="/idioma" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Suspense>
    </HashRouter>
  );
}
