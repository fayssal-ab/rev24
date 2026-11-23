import { lazy, Suspense, useEffect, useMemo } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout, Loading, Narrow } from './components/Layout';
import ModuleShell from './components/ModuleShell';
import { authEnabled, useAuth, useCanSeeOral, useIsAdmin } from './auth/auth';
import type { ReactNode } from 'react';
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
const TerminalPage = lazy(() => import('./pages/TerminalPage'));
const StatsLabPage = lazy(() => import('./pages/StatsLabPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const SupportsPage = lazy(() => import('./pages/SupportsPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const PendingPage = lazy(() => import('./pages/PendingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PrepPage = lazy(() => import('./pages/PrepPage'));

/** Private group site: when accounts are on, every page requires signing in. */
function AuthGate({ children }: { children: ReactNode }) {
  const { ready, user } = useAuth();
  if (!authEnabled) return <>{children}</>;
  if (!ready) return <Loading />;
  if (!user) return <AuthPage />;
  // new accounts wait for the admin's approval before seeing any content
  return user.status === 'approved' ? <>{children}</> : <PendingPage />;
}

function AdminRoute() {
  return useIsAdmin() ? <AdminPage /> : <Navigate to="/" replace />;
}

/** Old "Explorer" links keep their filters. */
function ToSupports() {
  const { search } = useLocation();
  return <Navigate to={`/supports${search}`} replace />;
}

function LoginRoute() {
  const user = useAuth((s) => s.user);
  return !authEnabled || user ? <Navigate to="/profil" replace /> : <AuthPage />;
}

/** The oral-presentation coach is private (see useCanSeeOral). */
function OralRoute() {
  return useCanSeeOral() ? <ProfilePage tab="oral" /> : <Navigate to="/profil" replace />;
}

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
          <AuthGate>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/m/:module" element={<ModuleShell />}>
                <Route index element={<ModulePage />} />
                <Route path="c/:chapter" element={<ChapterPage />} />
                <Route path="qcm" element={<QcmPage />} />
                <Route path="exercices" element={<ExercisesPage />} />
                <Route path="fiche" element={<SheetPage />} />
                <Route path="formulaire" element={<ReferencePage />} />
                <Route path="flashcards" element={<FlashcardsPage />} />
                <Route path="examen" element={<ExamPage />} />
                <Route path="supports" element={<SupportsPage />} />
              </Route>
              <Route path="/supports" element={<ExplorePage />} />
              <Route path="/explorer" element={<ToSupports />} />
              <Route path="/bibliotheque" element={<ToSupports />} />
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="/terminal" element={<TerminalPage />} />
              <Route path="/preparation" element={<PrepPage />} />
              <Route
                path="/stats-lab"
                element={
                  <Narrow>
                    <StatsLabPage />
                  </Narrow>
                }
              />
              <Route
                path="/glossaire"
                element={
                  <Narrow>
                    <GlossaryPage />
                  </Narrow>
                }
              />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/profil/oral" element={<OralRoute />} />
              <Route path="/profil/donnees" element={<ProfilePage tab="data" />} />
              {/* old links */}
              <Route path="/progression" element={<Navigate to="/profil" replace />} />
              <Route path="/oral/rm-rf" element={<Navigate to="/profil/oral" replace />} />
              <Route path="/connexion" element={<LoginRoute />} />
              <Route path="/24h" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthGate>
        </Suspense>
      </Layout>
      <BadgeWatcher />
    </HashRouter>
  );
}
