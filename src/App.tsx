import { lazy, Suspense, useEffect, useMemo } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout, Loading } from './components/Layout';
import { useStore } from './store/store';
import { useAllModules } from './hooks/useModule';
import { MODULES } from './lib/content';
import { earnedBadges } from './lib/mastery';

const Home = lazy(() => import('./pages/Home'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const QcmPage = lazy(() => import('./pages/QcmPage'));
const ExercisesPage = lazy(() => import('./pages/ExercisesPage'));
const SheetPage = lazy(() => import('./pages/SheetPage'));
const ReferencePage = lazy(() => import('./pages/ReferencePage'));
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'));
const ExamPage = lazy(() => import('./pages/ExamPage'));
const Rev24Page = lazy(() => import('./pages/Rev24Page'));
const TerminalPage = lazy(() => import('./pages/TerminalPage'));
const StatsLabPage = lazy(() => import('./pages/StatsLabPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const OralPage = lazy(() => import('./pages/OralPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Unlock badges whenever progress changes. */
function BadgeWatcher() {
  const content = useAllModules(MODULES.map((m) => m.id));
  const st = useStore();
  const questionsById = useMemo(() => Object.fromEntries((content ?? []).flatMap((c) => c.questions.map((q) => [q.id, { tags: q.tags }]))), [content]);
  useEffect(() => {
    if (!content) return;
    const earned = earnedBadges({
      qstats: st.qstats,
      exercises: st.exercises,
      read: st.read,
      missions: st.missions,
      questionsById,
      exams: st.exams,
      rev24Done: st.rev24Done,
      streak: st.streak.count,
      rootReset: !!st.missions['m-root-reset']
    });
    for (const b of earned) if (!st.badges.includes(b)) st.unlock(b);
  }, [content, questionsById, st]);
  return null;
}

export function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/m/:module" element={<ModulePage />} />
            <Route path="/m/:module/c/:chapter" element={<ChapterPage />} />
            <Route path="/m/:module/qcm" element={<QcmPage />} />
            <Route path="/m/:module/exercices" element={<ExercisesPage />} />
            <Route path="/m/:module/fiche" element={<SheetPage />} />
            <Route path="/m/:module/formulaire" element={<ReferencePage />} />
            <Route path="/m/:module/flashcards" element={<FlashcardsPage />} />
            <Route path="/m/:module/examen" element={<ExamPage />} />
            <Route path="/24h" element={<Rev24Page />} />
            <Route path="/terminal" element={<TerminalPage />} />
            <Route path="/stats-lab" element={<StatsLabPage />} />
            <Route path="/progression" element={<ProgressPage />} />
            <Route path="/glossaire" element={<GlossaryPage />} />
            <Route path="/oral/rm-rf" element={<OralPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
      <BadgeWatcher />
    </HashRouter>
  );
}
