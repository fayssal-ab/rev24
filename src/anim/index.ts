import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Anim = LazyExoticComponent<ComponentType<any>>;

/** Interactive animations referenced by name from content files (`{ "type": "animation", "component": "..." }`). */
export const ANIMATIONS: Record<string, Anim> = {
  BootSequence: lazy(() => import('./linux/BootSequence')),
  RootPasswordReset: lazy(() => import('./linux/RootPasswordReset')),
  PermissionCalculator: lazy(() => import('./linux/PermissionCalculator')),
  PasswdLineExplorer: lazy(() => import('./linux/PasswdLineExplorer')),
  FHSTree: lazy(() => import('./linux/FHSTree')),
  GrubConfigFlow: lazy(() => import('./linux/GrubConfigFlow')),
  SystemdStates: lazy(() => import('./linux/SystemdStates')),
  RpmVsDnf: lazy(() => import('./linux/RpmVsDnf')),
  LinuxTimeline: lazy(() => import('./linux/LinuxTimeline')),
  HypothesisTestVisualizer: lazy(() => import('./data/HypothesisTestVisualizer')),
  ErrorTable: lazy(() => import('./data/ErrorTable')),
  ChiSquareBuilder: lazy(() => import('./data/ChiSquareBuilder')),
  AnalysisTypesCards: lazy(() => import('./data/AnalysisTypesCards')),
  DataPipeline: lazy(() => import('./data/DataPipeline')),
  ChartChooser: lazy(() => import('./data/ChartChooser')),
  PandasReadPlayground: lazy(() => import('./data/PandasReadPlayground')),
  MatplotlibStyles: lazy(() => import('./data/MatplotlibStyles'))
};
