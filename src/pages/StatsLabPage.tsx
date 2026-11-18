import { Suspense, useEffect } from 'react';
import { PageTitle } from '../components/Layout';
import { useT } from '../hooks/useT';
import { ANIMATIONS } from '../anim';
import { useStore } from '../store/store';

export default function StatsLabPage() {
  const { t } = useT();
  useEffect(() => {
    useStore.getState().setLastModule('data');
  }, []);
  const H = ANIMATIONS.HypothesisTestVisualizer;
  const C = ANIMATIONS.ChiSquareBuilder;
  const E = ANIMATIONS.ErrorTable;
  return (
    <div className="space-y-6">
      <PageTitle back="/" title={t('lab.title')} />
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <H />
        <C />
        <E />
      </Suspense>
    </div>
  );
}
