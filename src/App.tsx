import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HTML_LANG, useT } from '@/i18n';
import { useApp } from '@/stores/app';
import Home from '@/pages/Home';
import Language from '@/pages/Language';
import { CoursePage, SubjectPage, SubjectsPage } from '@/pages/Subjects';
import LessonPage from '@/pages/LessonPage';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import Who from '@/pages/Who';
import { TopBar } from '@/components/Layout';
import { VoiceStatus } from '@/components/VoicePicker';
import { Capacitor } from '@capacitor/core';
import { App as NativeApp } from '@capacitor/app';

// Android's back button: back through the app's pages, and out of the app from the first one.
if (Capacitor.isNativePlatform()) {
  void NativeApp.addListener('backButton', ({ canGoBack }) => { if (canGoBack && location.hash !== '#/' && location.hash !== '') history.back(); else void NativeApp.exitApp(); });
}

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

/** Applies language, text size, colours and motion to the whole page. */
function Appearance() {
  const { lang, large, theme, motion, course, set } = useApp();
  // castellano unless someone changes it in Settings (older installs may still have no language stored)
  useEffect(() => { if (!lang) set({ lang: 'es' }); }, [lang, set]);
  useEffect(() => {
    const r = document.documentElement;
    r.lang = HTML_LANG[lang ?? 'es'];
    r.dataset.size = large ? 'large' : 'normal';
    if (theme === 'auto') delete r.dataset.theme; else r.dataset.theme = theme;
    r.dataset.motion = motion;
    // 5.º de Primaria and up: the same app with a less childish look
    r.dataset.age = course && /^(5P|6P|\dE)$/.test(course) ? 'teen' : 'kid';
  }, [lang, large, theme, motion, course]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <Appearance />
      <VoiceStatus />
      <Suspense fallback={<p className="p-6 text-center">…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/idioma" element={<Language />} />
        <Route path="/curso" element={<CoursePage />} />
        <Route path="/materias" element={<SubjectsPage />} />
        <Route path="/materia/:c/:s" element={<SubjectPage />} />
        <Route path="/leccion/:id" element={<LessonPage />} />
        <Route path="/progreso" element={<Progress />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/quien" element={<Who />} />
        <Route path="/adultos" element={<Hub />} />
        <Route path="/adultos/alumnos" element={<Pupils />} />
        <Route path="/adultos/fichas" element={<Sheets />} />
        <Route path="/adultos/pizarra" element={<Board />} />
        <Route path="/adultos/certificado" element={<Certificate />} />
        <Route path="/adultos/guia" element={<Guide />} />
        <Route path="/adultos/casa" element={<Family />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Suspense>
    </HashRouter>
  );
}
